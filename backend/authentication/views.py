from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import login, logout, authenticate
from game.models import User
from game.serializers import UserSerializer
from rest_framework.authtoken.models import Token

class AuthView(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def current_user(self, request):
        if not request.user.is_authenticated:
            return Response({'is_authenticated': False})
        return Response({
            'is_authenticated': True,
            'user': UserSerializer(request.user).data
        })

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=400)

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'status': 'success',
                'user': UserSerializer(user).data,
                'token': token.key
            })
        return Response({'error': 'Invalid credentials'}, status=400)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        if request.user.is_authenticated:
            # Delete token to invalidate it
            try:
                request.user.auth_token.delete()
            except (AttributeError, Token.DoesNotExist):
                pass
        logout(request)
        return Response({'status': 'success'})

    @action(detail=False, methods=['post'])
    def signup(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=400)

        if User.objects.filter(username=username).exists():
             return Response({'error': 'Username already exists'}, status=400)

        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'status': 'success',
                'user': UserSerializer(user).data,
                'token': token.key
            })
        except Exception as e:
            return Response({'error': str(e)}, status=400)
