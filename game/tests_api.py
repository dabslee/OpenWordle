from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import GamePreset, Game, GameAttempt
from django.utils import timezone

User = get_user_model()

class ApiTests(TestCase):
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
        # Force answer to be HELLO
        self.game.answer = 'HELLO'
        self.game.save()

    def test_preset_list(self):
        response = self.client.get('/api/presets/')
        self.assertEqual(response.status_code, 200)
        # There might be other presets, so just check if ours is there
        slugs = [p['slug'] for p in response.data]
        self.assertIn('test-preset', slugs)

    def test_game_status_guest(self):
        response = self.client.get(f'/api/game/{self.preset.slug}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'playing')
        self.assertEqual(response.data['guesses'], [])

    def test_game_status_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'/api/game/{self.preset.slug}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'playing')

    def test_submit_guess_correct(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f'/api/game/{self.preset.slug}/', {'guess': 'HELLO'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_solved'])
        self.assertEqual(response.data['result'][0]['state'], 'correct') # Assuming wordle_colorize returns dict or tuple

        # Check if attempt is saved
        attempt = GameAttempt.objects.get(user=self.user, game=self.game)
        self.assertEqual(attempt.guesses, ['HELLO'])

    def test_submit_guess_incorrect(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f'/api/game/{self.preset.slug}/', {'guess': 'WORLD'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data['is_solved'])
        self.assertEqual(response.data['result'][0]['state'], 'absent') # 'W' is not in 'HELLO'

    def test_submit_guess_invalid(self):
        self.client.force_authenticate(user=self.user)
        # Length
        response = self.client.post(f'/api/game/{self.preset.slug}/', {'guess': 'HI'}, format='json')
        self.assertEqual(response.status_code, 400)

        # Word bank
        response = self.client.post(f'/api/game/{self.preset.slug}/', {'guess': 'XXXXX'}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_auth_endpoints(self):
        # Signup
        response = self.client.post('/api/auth/signup/', {
            'username': 'newuser',
            'password': 'password',
            'email': 'new@example.com'
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user']['username'], 'newuser')

        # Current user
        response = self.client.get('/api/auth/user/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_authenticated'])
        self.assertEqual(response.data['user']['username'], 'newuser')

        # Logout
        response = self.client.post('/api/auth/logout/')
        self.assertEqual(response.status_code, 200)

        response = self.client.get('/api/auth/user/')
        self.assertFalse(response.data['is_authenticated'])

        # Login
        response = self.client.post('/api/auth/login/', {
            'username': 'newuser',
            'password': 'password'
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user']['username'], 'newuser')

    def test_pin_preset(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f'/api/presets/{self.preset.slug}/toggle_pin/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['pinned'])
        self.assertTrue(self.preset in self.user.pinned_presets.all())

        response = self.client.post(f'/api/presets/{self.preset.slug}/toggle_pin/')
        self.assertFalse(response.data['pinned'])
        self.assertFalse(self.preset in self.user.pinned_presets.all())
