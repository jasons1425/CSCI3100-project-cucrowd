from django.shortcuts import render
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
import json


class LogInView(APIView):
    # will follow DEFAULT_AUTHENTICATION_CLASSES in settings.py if unspecified
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = []

    def get(self, request, format=None):
        data = request.data
        content = {
            'user': data.get('username', None),
            'auth': data.get('auth', None),
        }
        return Response(content)

    def post(self, request, format=None):
        data = request.data
        username = data.get('username', None)
        password = data.get('password', None)
        if not (username and password):
            raise ValidationError({'result': False,
                                   'message': "Missing username or password."})
        user = authenticate(username=username, password=password)
        if user is not None and user.is_active:
            login(request, user)
            token = Token.objects.get_or_create(user=user)[0].key
            response = {'username': user.username,
                        'result': True,
                        'authorization': token}
            return Response(response)
        else:
            raise ValidationError({'result': False,
                                   'message': "Incorrect username or password."})


class LogOutView(APIView):
    def get(self, request, format=None):
        request.user.auth_token.delete()
        logout(request)
        return Response({})
