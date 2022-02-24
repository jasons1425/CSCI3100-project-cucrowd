from rest_framework.authentication import SessionAuthentication
from .authentication import ExpiringTokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from datetime import datetime, timedelta
import pytz


class LogInView(APIView):
    # will follow DEFAULT_AUTHENTICATION_CLASSES in settings.py if unspecified
    authentication_classes = [ExpiringTokenAuthentication, SessionAuthentication]
    permission_classes = []

    def get(self, request):
        user = request.user
        return Response({"endpoint": "login-get",
                         "username": user.username,
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
            response = Response({'username': user.username,
                                 'result': True,
                                 'authorization': token.key})
            if not created:
                token.created = datetime.utcnow().replace(tzinfo=pytz.utc)
                token.save()
            response.set_cookie("Authorization", "Token "+token.key)

            return response
        else:
            raise ValidationError({'result': False,
                                   'message': "Incorrect username or password."})


class LogOutView(APIView):
    def get(self, request):
        user = request.user
        return Response({"endpoint": "logout-get",
                         "username": user.username,
                         "isAuthenticated": user.is_authenticated})

    def post(self, request, format=None):
        if request.user.is_authenticated:
            request.user.auth_token.delete()
            logout(request)
            response = Response({"result": True})
            response.delete_cookie("Authorization")
            return response
        return Response({"result": False, "message": "Unauthenticated user."})


class SignUpView(APIView):
    permission_classes = []

    def get(self, request):
        user = request.user
        return Response({"endpoint": "signup-get",
                         "username": user.username,
                         "isAuthenticated": user.is_authenticated})

    def post(self, request):
        data = request.data
        username = data.get('username', None)
        email = data.get("email", None)
        password = data.get('password', None)
        if not (username and password and email):
            raise ValidationError({'result': False,
                                   'message': "Missing username, email or password."})
        try:
            new_user = User.objects.create_user(username=username, email=email, password=password)
            assert new_user is not None
            return Response({'result': True,
                             'username': new_user.username,
                             'email': new_user.email})
        except IntegrityError:  # username/email already exists, pending custom User model
            raise ValidationError({'result': False, 'message': "Username or email already exists."})
        except ValidationError:  # incorrect format of the email
            raise ValidationError({'result': False, 'message': "Incorrect format of email."})
        except AssertionError:
            raise ValidationError({'result': False, 'message': "Fail to create new users - unknown errors."})