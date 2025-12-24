from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import GamePreset, Game, GameAttempt
from django.utils import timezone
from rest_framework import status
from rest_framework.authtoken.models import Token

User = get_user_model()

class ApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password')
        self.token = Token.objects.create(user=self.user) # Create token manually for game tests
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
        # Guests should get 403 or 401 now that permissions are IsAuthenticated
        response = self.client.get(f'/api/game/?preset={self.preset.slug}')
        self.assertIn(response.status_code, [401, 403])

    def test_game_status_authenticated(self):
        # Explicitly use Token Authentication instead of force_authenticate
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get(f'/api/game/?preset={self.preset.slug}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'playing')

    def test_submit_guess_correct(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.post('/api/game/', {'guess': 'HELLO', 'preset': self.preset.slug}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_solved'])
        self.assertEqual(response.data['result'][0]['state'], 'correct')

        # Check if attempt is saved
        attempt = GameAttempt.objects.get(user=self.user, game=self.game)
        self.assertEqual(attempt.guesses, ['HELLO'])

    def test_submit_guess_incorrect(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.post('/api/game/', {'guess': 'WORLD', 'preset': self.preset.slug}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data['is_solved'])
        self.assertEqual(response.data['result'][0]['state'], 'absent') # 'W' is not in 'HELLO'

    def test_submit_guess_invalid(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        # Length
        response = self.client.post('/api/game/', {'guess': 'HI', 'preset': self.preset.slug}, format='json')
        self.assertEqual(response.status_code, 400)

        # Word bank
        response = self.client.post('/api/game/', {'guess': 'XXXXX', 'preset': self.preset.slug}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_auth_endpoints(self):
        # Clear credentials from setUp
        self.client.credentials()

        # Signup
        response = self.client.post('/api/auth/signup/', {
            'username': 'newuser',
            'password': 'password',
            'email': 'new@example.com'
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user']['username'], 'newuser')
        self.assertIn('token', response.data)

        token = response.data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)

        # Current user
        response = self.client.get('/api/auth/user/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_authenticated'])
        self.assertEqual(response.data['user']['username'], 'newuser')

        # Logout
        response = self.client.post('/api/auth/logout/')
        self.assertEqual(response.status_code, 200)

        # Remove token from client
        self.client.credentials()
        response = self.client.get('/api/auth/user/')
        # Should show not authenticated (is_authenticated: False)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data['is_authenticated'])

        # Login
        response = self.client.post('/api/auth/login/', {
            'username': 'newuser',
            'password': 'password'
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user']['username'], 'newuser')
        self.assertIn('token', response.data)

    def test_pin_preset(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.post(f'/api/presets/{self.preset.slug}/toggle_pin/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['pinned'])
        self.assertTrue(self.preset in self.user.pinned_presets.all())

        response = self.client.post(f'/api/presets/{self.preset.slug}/toggle_pin/')
        self.assertFalse(response.data['pinned'])
        self.assertFalse(self.preset in self.user.pinned_presets.all())
