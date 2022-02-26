from rest_framework.authentication import SessionAuthentication
from .authentication import ExpiringTokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.core.validators import validate_email
from django.core.mail import send_mail, EmailMultiAlternatives
from django.core.exceptions import ValidationError as FieldValidationError
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from backend.settings import EMAIL_HOST_USER
from rest_framework.exceptions import ValidationError
from django_rest_passwordreset.signals import reset_password_token_created
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
        username = username.lower()
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
        if username != username.lower():
            raise ValidationError({'result': False,
                                   'message': "The username must consist of lowercase characters only."})
        try:
            validate_email(email)
            new_user = User.objects.create_user(username=username, email=email, password=password)
            assert new_user is not None
            send_mail("Account created!",
                      f"Thank you for signing up, {new_user.username}",
                      EMAIL_HOST_USER,
                      [email],
                      fail_silently=False)
            return Response({'result': True,
                             'username': new_user.username,
                             'email': new_user.email})
        except IntegrityError:  # username/email already exists, pending custom User model
            raise ValidationError({'result': False, 'message': "Username or email already exists."})
        except FieldValidationError:  # incorrect format of the email
            raise ValidationError({'result': False, 'message': "Incorrect format of email."})
        except AssertionError:
            raise ValidationError({'result': False, 'message': "Fail to create new users - unknown errors."})


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    user_name = reset_password_token.user.username
    user_email = reset_password_token.user.email
    abs_uri = instance.request.build_absolute_uri(reverse("password_reset:reset-password-confirm"))
    reset_url = f"{abs_uri}?token={reset_password_token.key}"
    email_message = f"Dear {user_name},\n\n" \
                    f"Please click the below link to reset your password.\n\n" \
                    f"{reset_url}\n\n" \
                    f"Regards, CU Crowd project team\n\n" \
                    f"你是忘記了，還是害怕想起來？"
    send_mail("Reset Password Email",
              email_message,
              EMAIL_HOST_USER,
              [user_email],
              fail_silently=False)
