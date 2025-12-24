from rest_framework import viewsets, permissions, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import GamePreset, Game, GameAttempt
from .serializers import GamePresetSerializer, GuessInputSerializer
from .permissions import IsOwnerOrReadOnly
from game.utils import wordle_colorize
import datetime

class PresetViewSet(viewsets.ModelViewSet):
    queryset = GamePreset.objects.all()
    serializer_class = GamePresetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    lookup_field = 'slug'

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_pin(self, request, slug=None):
        preset = self.get_object()
        user = request.user
        if preset in user.pinned_presets.all():
            user.pinned_presets.remove(preset)
            pinned = False
        else:
            user.pinned_presets.add(preset)
            pinned = True
        return Response({'status': 'success', 'pinned': pinned})

class GameView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        preset_slug = request.query_params.get('preset')
        if preset_slug:
            preset = get_object_or_404(GamePreset, slug=preset_slug)
        else:
            # Default preset if exists
            preset = GamePreset.objects.first()
            if not preset:
                return Response({'error': 'No presets found'}, status=404)

        game = Game.get_or_create_daily_game(preset)
        attempt, created = GameAttempt.objects.get_or_create(user=request.user, game=game)
        guesses = attempt.guesses

        results = []
        is_solved = False
        is_failed = False

        # Calculate results for existing guesses
        for guess in guesses:
            colors_data = list(wordle_colorize(guess, game.answer))
            results.append([{'letter': l, 'state': s} for l, s in colors_data])

        if guesses and guesses[-1] == game.answer:
            is_solved = True

        if len(guesses) >= preset.max_guesses and not is_solved:
            is_failed = True

        remaining_guesses = preset.max_guesses - len(guesses)
        status_str = 'won' if is_solved else ('lost' if is_failed else 'playing')

        data = {
            'preset': GamePresetSerializer(preset, context={'request': request}).data,
            'guesses': guesses,
            'remaining_guesses': remaining_guesses,
            'is_solved': is_solved,
            'is_failed': is_failed,
            'status': status_str,
            'results': results
        }
        return Response(data)

    def post(self, request):
        # Submit a guess
        preset_slug = request.data.get('preset')
        if preset_slug:
            preset = get_object_or_404(GamePreset, slug=preset_slug)
        else:
            preset = GamePreset.objects.first()
            if not preset:
                 return Response({'error': 'No presets found'}, status=404)

        serializer = GuessInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        guess = serializer.validated_data['guess'].strip().upper()
        game = Game.get_or_create_daily_game(preset)

        # Validation
        if len(guess) != preset.letter_count:
            return Response({'error': f'Guess must be {preset.letter_count} letters long'}, status=400)

        valid_words = [w.strip().upper() for w in preset.word_bank.replace(',', ' ').split()]
        if guess not in valid_words:
             return Response({'error': 'Not in word bank'}, status=400)

        colors_data = list(wordle_colorize(guess, game.answer))
        result = [{'letter': l, 'state': s} for l, s in colors_data]

        attempt, created = GameAttempt.objects.get_or_create(user=request.user, game=game)
        if len(attempt.guesses) >= preset.max_guesses:
                return Response({'error': 'Game over'}, status=400)

        # Check if already solved
        if attempt.guesses and attempt.guesses[-1] == game.answer:
                return Response({'error': 'Already solved'}, status=400)

        attempt.guesses.append(guess)
        attempt.save()

        guesses = attempt.guesses
        is_solved = (guess == game.answer)
        is_failed = len(guesses) >= preset.max_guesses and not is_solved
        remaining_guesses = preset.max_guesses - len(guesses)

        return Response({
            'guess': guess,
            'result': result,
            'is_solved': is_solved,
            'is_failed': is_failed,
            'remaining_guesses': remaining_guesses
        })

class StatelessGuessView(views.APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'stateless_guess'

    def post(self, request):
        preset_slug = request.data.get('preset')
        if preset_slug:
            preset = get_object_or_404(GamePreset, slug=preset_slug)
        else:
            preset = GamePreset.objects.first()
            if not preset:
                 return Response({'error': 'No presets found'}, status=404)

        serializer = GuessInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        guess = serializer.validated_data['guess'].strip().upper()

        # We need the game to know the answer
        game = Game.get_or_create_daily_game(preset)

        # Validation
        if len(guess) != preset.letter_count:
            return Response({'error': f'Guess must be {preset.letter_count} letters long'}, status=400)

        valid_words = [w.strip().upper() for w in preset.word_bank.replace(',', ' ').split()]
        if guess not in valid_words:
             return Response({'error': 'Not in word bank'}, status=400)

        colors_data = list(wordle_colorize(guess, game.answer))
        result = [{'letter': l, 'state': s} for l, s in colors_data]
        is_solved = (guess == game.answer)

        return Response({
            'guess': guess,
            'result': result,
            'is_solved': is_solved,
            'is_failed': False,
            'remaining_guesses': None
        })

class GameRefreshStatusView(views.APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'stateless_guess'

    def get(self, request):
        now = timezone.now()
        tomorrow = now.date() + datetime.timedelta(days=1)
        next_midnight = timezone.datetime.combine(tomorrow, datetime.time.min, tzinfo=now.tzinfo)

        time_until = next_midnight - now
        seconds_until = int(time_until.total_seconds())

        return Response({
            'seconds_until_refresh': seconds_until,
            'next_refresh_at': next_midnight.isoformat()
        })
