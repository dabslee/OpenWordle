from rest_framework import serializers
from .models import GamePreset, GameAttempt, Game, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class GamePresetSerializer(serializers.ModelSerializer):
    creator = PublicUserSerializer(read_only=True)
    is_pinned = serializers.SerializerMethodField()

    class Meta:
        model = GamePreset
        fields = ['id', 'title', 'description', 'letter_count', 'max_guesses', 'slug', 'creator', 'is_pinned']

    def get_is_pinned(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj in user.pinned_presets.all()
        return False

class GameAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameAttempt
        fields = ['guesses', 'created_at']

class GuessInputSerializer(serializers.Serializer):
    guess = serializers.CharField()
