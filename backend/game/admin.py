from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, GamePreset, Game, GameAttempt

admin.site.register(User, UserAdmin)

@admin.register(GamePreset)
class GamePresetAdmin(admin.ModelAdmin):
    list_display = ('title', 'creator', 'slug')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('preset', 'generation_date', 'answer')
    list_filter = ('preset', 'generation_date')

@admin.register(GameAttempt)
class GameAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'created_at')
