from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import api_views

router = DefaultRouter()
router.register(r'presets', api_views.PresetViewSet, basename='api_presets')

urlpatterns = [
    # API URLs
    path('api/', include(router.urls)),
    path('api/game/', api_views.GameView.as_view(), name='api_game_default'),
    path('api/game/<slug:slug>/', api_views.GameView.as_view(), name='api_game'),
    path('api/auth/user/', api_views.AuthView.as_view({'get': 'current_user'}), name='api_current_user'),
    path('api/auth/login/', api_views.AuthView.as_view({'post': 'login'}), name='api_login'),
    path('api/auth/logout/', api_views.AuthView.as_view({'post': 'logout'}), name='api_logout'),
    path('api/auth/signup/', api_views.AuthView.as_view({'post': 'signup'}), name='api_signup'),

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
]
