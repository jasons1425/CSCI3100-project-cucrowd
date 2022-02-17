from django.shortcuts import render
from rest_framework.authentication import SessionAuthentication
from .models import ExpiringTokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
import json
from datetime import datetime, timedelta


class LogInView(APIView):
    # will follow DEFAULT_AUTHENTICATION_CLASSES in settings.py if unspecified
    authentication_classes = [ExpiringTokenAuthentication, SessionAuthentication]
    permission_classes = []

    def get(self, request):
        user = request.user
        return Response({"endpoint": "logout-get",
                         "user": user.username,
                         "isAuthenticated": user.is_authenticated})

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
            token, created = Token.objects.get_or_create(user=user)

            if not created:
                token.created = datetime.utcnow()
                token.save()

            response = {'username': user.username,
                        'result': True,
                        'authorization': token.key}
            return Response(response)
        else:
            raise ValidationError({'result': False,
                                   'message': "Incorrect username or password."})


class LogOutView(APIView):
    def get(self, request):
        user = request.user
        return Response({"endpoint": "logout-get",
                         "user": user.username,
                         "isAuthenticated": user.is_authenticated})

    def post(self, request, format=None):
        if request.user.is_authenticated:
            request.user.auth_token.delete()
            logout(request)
            return Response({"result": True})
        return Response({"result": False, "message": "Unauthenticated user."})
