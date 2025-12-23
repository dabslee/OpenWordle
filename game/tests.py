from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import GamePreset, Game, GameAttempt
from django.urls import reverse
from django.contrib.messages import get_messages

User = get_user_model()

class GameTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client = Client()
        self.client.login(username='testuser', password='password')

        # Verify default preset exists (from migration)
        self.default_preset = GamePreset.objects.get(slug='')

    def test_default_preset_exists(self):
        self.assertEqual(self.default_preset.title, 'Wordle')
        self.assertEqual(self.default_preset.letter_count, 5)

    def test_daily_game_consistency(self):
        # First call creates
        game1 = Game.get_or_create_daily_game(self.default_preset)
        self.assertEqual(game1.generation_date, timezone.now().date())

        # Second call returns same
        game2 = Game.get_or_create_daily_game(self.default_preset)
        self.assertEqual(game1, game2)
        self.assertEqual(game1.answer, game2.answer)

    def test_create_preset(self):
        response = self.client.post(reverse('create_preset'), {
            'title': 'My Custom Wordle',
            'description': 'Hard mode',
            'letter_count': 6,
            'max_guesses': 5,
            'word_bank': 'PLANET, ROCKET',
            'slug': 'my-custom'
        })
        self.assertRedirects(response, reverse('browse_presets'))

        preset = GamePreset.objects.get(slug='my-custom')
        self.assertEqual(preset.creator, self.user)
        self.assertTrue(preset in self.user.pinned_presets.all())

    def test_play_game_logic(self):
        # Setup a controlled game
        preset = GamePreset.objects.create(
            title='Test',
            letter_count=3,
            max_guesses=3,
            word_bank='CAT, DOG',
            slug='test-game',
            creator=self.user
        )
        # Force answer
        game = Game.get_or_create_daily_game(preset)
        game.answer = 'CAT'
        game.save()

        # Play
        url = reverse('play_game', kwargs={'slug': 'test-game'})

        # Guess 1: DOG (Wrong)
        self.client.post(url, {'guess': 'DOG'}, follow=True)
        attempt = GameAttempt.objects.get(user=self.user, game=game)
        self.assertEqual(attempt.guesses, ['DOG'])

        # Guess 2: CAT (Correct)
        response = self.client.post(url, {'guess': 'CAT'}, follow=True)
        attempt.refresh_from_db()
        self.assertEqual(attempt.guesses, ['DOG', 'CAT'])

        # Verify response context
        self.assertContains(response, 'Congratulations!')

    def test_pinning(self):
        preset = GamePreset.objects.create(title='Pin Me', slug='pin-me')
        url = reverse('toggle_pin', kwargs={'slug': 'pin-me'})

        # Pin
        self.client.get(url)
        self.assertTrue(preset in self.user.pinned_presets.all())

        # Unpin
        self.client.get(url)
        self.assertFalse(preset in self.user.pinned_presets.all())

    def test_invalid_guess_message(self):
        # Setup
        preset = GamePreset.objects.create(
            title='Test',
            letter_count=3,
            max_guesses=3,
            word_bank='CAT, DOG',
            slug='test-msg',
            creator=self.user
        )
        Game.get_or_create_daily_game(preset)
        url = reverse('play_game', kwargs={'slug': 'test-msg'})

        # Guess Invalid Word
        response = self.client.post(url, {'guess': 'ZZZ'}, follow=True)

        # Check messages
        messages = list(get_messages(response.wsgi_request))
        self.assertEqual(len(messages), 1)
        self.assertEqual(str(messages[0]), 'Not in word bank')

    def test_signup_flow(self):
        self.client.logout()
        url = reverse('signup')
        # UserCreationForm uses password1/password2
        response = self.client.post(url, {'username': 'newuser', 'password1': 'complexPassword123!', 'password2': 'complexPassword123!'}, follow=True)

        self.assertRedirects(response, reverse('play_game_default'))
        self.assertTrue(User.objects.filter(username='newuser').exists())
