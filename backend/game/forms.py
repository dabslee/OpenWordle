from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model
from .models import GamePreset

class GamePresetForm(forms.ModelForm):
    class Meta:
        model = GamePreset
        fields = ['title', 'description', 'letter_count', 'max_guesses', 'word_bank', 'slug']
        help_texts = {
            'word_bank': 'Enter words separated by spaces or commas.',
            'slug': 'Leave blank for default (only one allowed) or enter a unique identifier.',
        }

    def clean_slug(self):
        slug = self.cleaned_data['slug']
        # If slug is empty, check if another one with empty slug exists (excluding self)
        if slug == '':
            qs = GamePreset.objects.filter(slug='')
            if self.instance.pk:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise forms.ValidationError("A default preset with blank slug already exists.")
        return slug

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = get_user_model()
        fields = ("username",)
