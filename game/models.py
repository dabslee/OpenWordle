from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils import timezone
import random

class GamePreset(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    letter_count = models.IntegerField(default=5)
    max_guesses = models.IntegerField(default=6)
    word_bank = models.TextField()  # Comma or newline separated
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='created_presets')
    slug = models.SlugField(unique=True, blank=True)

    def __str__(self):
        return self.title

class User(AbstractUser):
    pinned_presets = models.ManyToManyField(GamePreset, blank=True, related_name='pinned_by')

class Game(models.Model):
    generation_date = models.DateField(default=timezone.now)
    answer = models.CharField(max_length=200)
    preset = models.ForeignKey(GamePreset, on_delete=models.CASCADE, related_name='games')

    class Meta:
        unique_together = ('generation_date', 'preset')

    def __str__(self):
        return f"{self.preset.title} - {self.generation_date}"

    @classmethod
    def get_or_create_daily_game(cls, preset):
        today = timezone.now().date()
        try:
            return cls.objects.get(preset=preset, generation_date=today)
        except cls.DoesNotExist:
            words = [w.strip().upper() for w in preset.word_bank.replace(',', ' ').split() if len(w.strip()) == preset.letter_count]
            if words:
                answer = random.choice(words)
            else:
                answer = "?" * preset.letter_count # Fallback

            game, created = cls.objects.get_or_create(
                preset=preset,
                generation_date=today,
                defaults={'answer': answer}
            )
            return game

class GameAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attempts')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='attempts')
    guesses = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.game}"
