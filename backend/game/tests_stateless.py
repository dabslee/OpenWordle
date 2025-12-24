from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import GamePreset, Game, GameAttempt

User = get_user_model()

class StatelessApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password')
        self.preset = GamePreset.objects.create(
            title='Test Preset',
            description='Test Description',
            letter_count=5,
            max_guesses=6,
            word_bank='HELLO,WORLD',
            slug='test-preset',
            creator=self.user
        )
        self.game = Game.get_or_create_daily_game(self.preset)
        self.game.answer = 'HELLO'
        self.game.save()

    def test_stateless_guess_correct(self):
        # No authentication
        response = self.client.post('/api/game/guess/', {'guess': 'HELLO', 'preset': self.preset.slug}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_solved'])
        self.assertEqual(response.data['result'][0]['state'], 'correct')

        # Verify no attempt created
        self.assertFalse(GameAttempt.objects.exists())

    def test_stateless_guess_incorrect(self):
        response = self.client.post('/api/game/guess/', {'guess': 'WORLD', 'preset': self.preset.slug}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data['is_solved'])
        self.assertEqual(response.data['result'][0]['state'], 'absent')
        self.assertFalse(GameAttempt.objects.exists())

    def test_stateless_guess_invalid(self):
        # Length
        response = self.client.post('/api/game/guess/', {'guess': 'HI', 'preset': self.preset.slug}, format='json')
        self.assertEqual(response.status_code, 400)

        # Word bank
        response = self.client.post('/api/game/guess/', {'guess': 'XXXXX', 'preset': self.preset.slug}, format='json')
        self.assertEqual(response.status_code, 400)
