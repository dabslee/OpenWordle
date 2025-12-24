from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import api_views

import os
from pathlib import Path
from dotenv import load_dotenv
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR.parent / ".env")

router = DefaultRouter()
router.register(r'presets', api_views.PresetViewSet, basename='api_presets')

backend_ui = [
    # Existing Template URLs
    path('', views.play_game, name='play_game_default'),
    path('presets/', views.browse_presets, name='browse_presets'),
    path('presets/create/', views.create_preset, name='create_preset'),
    path('presets/<slug:slug>/edit/', views.edit_preset, name='edit_preset'),
    path('presets/<slug:slug>/delete/', views.delete_preset, name='delete_preset'),
    path('presets/pin/<path:slug>/', views.toggle_pin, name='toggle_pin'),
    path('presets/pin/', views.toggle_pin, {'slug': ''}, name='toggle_pin_default'),
    path('validate/<slug:slug>/', views.validate_guess, name='validate_guess'),
    path('validate/', views.validate_guess, {'slug': ''}, name='validate_guess_default'),
    path('<slug:slug>/', views.play_game, name='play_game'),
] if (os.getenv("enable_backend_ui") == "True") else []

urlpatterns = [
    # API URLs
    path('api/', include(router.urls)),
    path('api/game/guess/', api_views.StatelessGuessView.as_view(), name='api_game_guess'),
    path('api/game/', api_views.GameView.as_view(), name='api_game'),
] + backend_ui
