from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.AuthView.as_view({'get': 'current_user'}), name='api_current_user'),
    path('login/', views.AuthView.as_view({'post': 'login'}), name='api_login'),
    path('logout/', views.AuthView.as_view({'post': 'logout'}), name='api_logout'),
    path('signup/', views.AuthView.as_view({'post': 'signup'}), name='api_signup'),
]
