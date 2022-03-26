from rest_framework.authentication import SessionAuthentication
from .authentication import ExpiringTokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout, authenticate
# from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.core.validators import validate_email
from django.core.mail import send_mail
from django.core.exceptions import ValidationError as FieldValidationError
from django.dispatch import receiver
from django.urls import reverse
from backend.settings import EMAIL_HOST_USER
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from django_rest_passwordreset.signals import reset_password_token_created
from user_auth.models import StudentProfile, OrgUserProfile, validate_sid
from user_auth.serializers import StudentProfileSerializer, OrgProfileSerializer
from datetime import datetime
import pytz


class LogInView(APIView):
    # will follow DEFAULT_AUTHENTICATION_CLASSES in settings.py if unspecified
    authentication_classes = [ExpiringTokenAuthentication, SessionAuthentication]
    permission_classes = []

    def get(self, request):
        user = request.user
        response_dict = {"endpoint": "login-get",
                         "username": user.username,
                         "isAuthenticated": user.is_authenticated}
        if user.is_authenticated:
            if user.is_org:  # organization user
                profile = OrgUserProfile.objects.filter(user=user)
                if profile:  # ensure the queryset is non-empty
                    profile = profile[0]  # get the first query result
                    response_dict['org_name'] = profile.org_name
            else:  # student user
                profile = StudentProfile.objects.filter(user=user)
                if profile:  # ensure the queryset is non-empty
                    profile = profile[0]
                    response_dict['sid'] = profile.sid
                    response_dict['major'] = profile.major
                    response_dict['admission year'] = profile.admission_year
        return Response(response_dict)

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
        response_dict = {"endpoint": "logout-get",
                         "username": user.username,
                         "isAuthenticated": user.is_authenticated}
        if user.is_authenticated:
            if user.is_org:  # organization user
                profile = OrgUserProfile.objects.filter(user=user)
                if profile:  # ensure the queryset is non-empty
                    profile = profile[0]  # get the first query result
                    response_dict['org_name'] = profile.org_name
            else:  # student user
                profile = StudentProfile.objects.filter(user=user)
                if profile:  # ensure the queryset is non-empty
                    profile = profile[0]
                    response_dict['sid'] = profile.sid
                    response_dict['major'] = profile.major
                    response_dict['admission year'] = profile.admission_year
        return Response(response_dict)

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
        response_dict = {"endpoint": "signup-get",
                         "username": user.username,
                         "isAuthenticated": user.is_authenticated}
        if user.is_authenticated:
            if user.is_org:  # organization user
                profile = OrgUserProfile.objects.filter(user=user)
                if profile:  # ensure the queryset is non-empty
                    profile = profile[0]  # get the first query result
                    response_dict['org_name'] = profile.org_name
            else:  # student user
                profile = StudentProfile.objects.filter(user=user)
                if profile:  # ensure the queryset is non-empty
                    profile = profile[0]
                    response_dict['sid'] = profile.sid
                    response_dict['major'] = profile.major
                    response_dict['admission year'] = profile.admission_year
        return Response(response_dict)

    def post(self, request):
        data = request.data
        username = data.get('username', None)
        email = data.get("email", None)
        password = data.get('password', None)
        sid = data.get("sid", None)
        gender = data.get("gender", None)
        date_of_birth = data.get("date_of_birth", None)
        major = data.get("major", None)
        admission_year = data.get("admission_year", None)

        if not (username and password and email and sid
                and gender and date_of_birth and major and admission_year):
            raise ValidationError({'result': False,
                                   'message': "Missing values."})
        if username != username.lower():
            raise ValidationError({'result': False,
                                   'message': "The username must consist of lowercase characters only."})
        try:
            date_of_birth = datetime.strptime(date_of_birth, "%Y-%m-%d").date()
            admission_year = datetime.strptime(admission_year, "%Y-%m-%d").date()
        except ValueError as e:
            raise ValidationError({'result': False,
                                   'message': "date_of_birth or admission_year has invalid date format. "
                                              "Expected %Y-%m-%d"})

        try:
            validate_email(email)
            validate_sid(sid)
            user_model = get_user_model()
            # new_user = user_model.objects.create_user(username=username, email=email,
            #                                           password=password, gender=gender,
            #                                           date_of_birth=date_of_birth)
            new_user = user_model.objects.create_user(username=username, email=email, password=password)
            assert new_user is not None
            new_profile = StudentProfile.objects.create(user=new_user, gender=gender, date_of_birth=date_of_birth,
                                                        sid=sid, major=major, admission_year=admission_year)
            if new_profile is None:
                new_user.delete()
                raise AssertionError
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
        except FieldValidationError as e:  # incorrect format of the email
            raise ValidationError({'result': False, 'message': f"{e}"})
        except AssertionError:
            raise ValidationError({'result': False, 'message': "Fail to create new users - unknown errors."})


class ProfileView(ModelViewSet):
    serializer_class = StudentProfileSerializer
    queryset = StudentProfile.objects.all()
    permission_classes_by_action = {
        'create': [IsAdminUser],
        'list': [IsAuthenticated],
        'retrieve': [IsAuthenticated],
        'destroy': [IsAdminUser],
        'update': [IsAuthenticated],
        'partial_update': [IsAuthenticated],
    }
    lookup_field = "user__username"

    def list(self, request, *args, **kwargs):
        if request.user.is_org:
            return super().list(request, *args, **kwargs)
        raise ValidationError({"result": False,
                               "message": "Profile listing view only available for organization users."})

    def update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("user.") or key == "user":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = False
        if instance.user.id is not user.id:
            raise ValidationError({"result": False, "message": "Only profile owner can edit the content."})
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['GET'], name='get my profile')
    def me(self, request, *args, **kwargs):
        user = request.user
        if user.is_org:
            profile = OrgUserProfile.objects.filter(user=user)
            if not profile:
                raise ValidationError({"result": False, "message": "Profile not found."})
            serializer = OrgProfileSerializer(profile[0], many=False)
        else:
            profile = self.queryset.filter(user=user)
            if not profile:
                raise ValidationError({"result": False, "message": "Profile not found."})
            serializer = self.serializer_class(profile[0], many=False)
        return Response(serializer.data)

    # ref: https://stackoverflow.com/a/54221108/16418649
    @action(detail=False, methods=['GET'],
            name='get org user profile', url_path=r"org/(?P<username>[^\.=]+)")
    def org(self, request, username):
        profile = OrgUserProfile.objects.filter(user__username=username)
        if not profile:
            raise ValidationError({"result": False, "message": "Profile not found."})
        serializer = OrgProfileSerializer(profile[0], many=False)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("user.") or key == "user":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = False
        if instance.user.id is not user.id:
            raise ValidationError({"result": False, "message": "Only profile owner can update the content."})
        return super().partial_update(request, *args, **kwargs)

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    user_name = reset_password_token.user.username
    user_email = reset_password_token.user.email
    # abs_uri = instance.request.build_absolute_uri(reverse("password_reset:reset-password-confirm"))
    # reset_url = f"{abs_uri}?token={reset_password_token.key}"
    reset_url = f"http://localhost:3000/resetpassword/?token={reset_password_token.key}"
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
