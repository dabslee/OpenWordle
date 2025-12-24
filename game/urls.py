from django.urls import path
from . import views

urlpatterns = [
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
]
