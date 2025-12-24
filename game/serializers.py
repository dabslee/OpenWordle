from rest_framework import serializers
from .models import GamePreset, GameAttempt, Game, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class GamePresetSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
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

class GameStateSerializer(serializers.Serializer):
    preset = GamePresetSerializer()
    guesses = serializers.ListField(child=serializers.CharField())
    remaining_guesses = serializers.IntegerField()
    is_solved = serializers.BooleanField()
    is_failed = serializers.BooleanField()
    status = serializers.CharField() # 'playing', 'won', 'lost'
    results = serializers.ListField(child=serializers.ListField(), required=False) # Color results for guesses

class GuessInputSerializer(serializers.Serializer):
    guess = serializers.CharField()
