from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import GamePreset
from rest_framework.authtoken.models import Token

User = get_user_model()

class PresetPublicTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password')
        self.token = Token.objects.create(user=self.user)
        self.preset = GamePreset.objects.create(
            title='Test Preset',
            description='Test Description',
            letter_count=5,
            max_guesses=6,
            word_bank='HELLO',
            slug='test-preset',
            creator=self.user
        )

    def test_list_presets_unauthenticated(self):
        # Ensure no credentials
        self.client.credentials()
        response = self.client.get('/api/presets/')
        self.assertEqual(response.status_code, 200)

        # Check is_pinned is False
        data = response.data
        # Assuming pagination is off or default response structure
        # If paginated, data might be in 'results' key
        results = data['results'] if 'results' in data else data

        target_preset = next((p for p in results if p['slug'] == self.preset.slug), None)
        self.assertIsNotNone(target_preset)
        self.assertFalse(target_preset['is_pinned'])

    def test_list_presets_authenticated(self):
        # Pin the preset for the user
        self.user.pinned_presets.add(self.preset)

        # Authenticate
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get('/api/presets/')
        self.assertEqual(response.status_code, 200)

        results = response.data['results'] if 'results' in response.data else response.data
        target_preset = next((p for p in results if p['slug'] == self.preset.slug), None)
        self.assertIsNotNone(target_preset)
        self.assertTrue(target_preset['is_pinned'])
