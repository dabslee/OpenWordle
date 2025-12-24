from rest_framework import viewsets, permissions, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import login, logout, authenticate
from .models import GamePreset, Game, GameAttempt, User
from .serializers import GamePresetSerializer, GuessInputSerializer, UserSerializer
from .permissions import IsOwnerOrReadOnly
from game.utils import wordle_colorize

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
    def get(self, request, slug=None):
        if slug:
            preset = get_object_or_404(GamePreset, slug=slug)
        else:
            # Default preset if exists
            preset = GamePreset.objects.first()
            if not preset:
                return Response({'error': 'No presets found'}, status=404)

        game = Game.get_or_create_daily_game(preset)

        guesses = []
        is_solved = False
        is_failed = False
        results = []

        if request.user.is_authenticated:
            attempt, created = GameAttempt.objects.get_or_create(user=request.user, game=game)
            guesses = attempt.guesses

            # Calculate results for existing guesses
            for guess in guesses:
                colors_data = list(wordle_colorize(guess, game.answer))
                results.append([{'letter': l, 'state': s} for l, s in colors_data])

            if guesses and guesses[-1] == game.answer:
                is_solved = True

            if len(guesses) >= preset.max_guesses and not is_solved:
                is_failed = True
        else:
            # For guests, we might want to accept guesses in query params or something,
            # but usually frontend manages state.
            # However, `validate_guess` endpoint handles guest logic better.
            # Here we just return initial game state.
            pass

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

    def post(self, request, slug=None):
        # Submit a guess
        if slug:
            preset = get_object_or_404(GamePreset, slug=slug)
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
        is_correct = (guess == game.answer)

        if request.user.is_authenticated:
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
        else:
            # Stateless validation for guests
            guesses = [guess] # Just return the current guess result
            is_solved = is_correct
            is_failed = False # Can't track failure without state
            remaining_guesses = preset.max_guesses # Placeholder

        return Response({
            'guess': guess,
            'result': result,
            'is_solved': is_solved,
            'is_failed': is_failed,
            'remaining_guesses': remaining_guesses
        })

class AuthView(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def current_user(self, request):
        if not request.user.is_authenticated:
            return Response({'is_authenticated': False})
        return Response({
            'is_authenticated': True,
            'user': UserSerializer(request.user).data
        })

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=400)

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return Response({'status': 'success', 'user': UserSerializer(user).data})
        return Response({'error': 'Invalid credentials'}, status=400)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        logout(request)
        return Response({'status': 'success'})

    @action(detail=False, methods=['post'])
    def signup(self, request):
        # Basic signup
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=400)

        if User.objects.filter(username=username).exists():
             return Response({'error': 'Username already exists'}, status=400)

        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            login(request, user)
            return Response({'status': 'success', 'user': UserSerializer(user).data})
        except Exception as e:
            return Response({'error': str(e)}, status=400)
