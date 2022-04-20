from rest_framework.authentication import SessionAuthentication
from .authentication import ExpiringTokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.core.validators import validate_email
from django.core.mail import send_mail
from django.core.exceptions import ValidationError as FieldValidationError
from django.dispatch import receiver
from django.utils.crypto import get_random_string
from backend.settings import EMAIL_HOST_USER, MEDIA_ROOT
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.exceptions import ValidationError, status
from rest_framework.decorators import action, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django_rest_passwordreset.signals import reset_password_token_created
from user_auth.models import StudentProfile, OrgUserProfile, validate_sid, \
    get_avatar_fp, validate_birth, validate_admission
from user_auth.serializers import StudentProfileSerializer, OrgProfileSerializer
from experiment.serializers import EnrollmentSerializer, ExperimentSerializer, EnrollmentPreviewSerializer
from teamformation.serializers import TeamApplicationSerializer, TeamPreviewSerializer
from questionnaire.serializers import QuestionnaireSerializer,QuestionnairePreviewSerializer,AnswerSerializer,AnswerPreviewSerializer
from datetime import datetime
import pytz
import os
import re


class LogInView(APIView):
    # will follow DEFAULT_AUTHENTICATION_CLASSES in settings.py if unspecified
    authentication_classes = [ExpiringTokenAuthentication, SessionAuthentication]
    permission_classes = [AllowAny]

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
            if getattr(request.user, 'auth_token', None):
                request.user.auth_token.delete()
            logout(request)
            response = Response({"result": True})
            response.delete_cookie("Authorization")
            return response
        return Response({"result": False, "message": "Unauthenticated user."})


class SignUpView(APIView):
    permission_classes = [AllowAny]

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
        password = get_random_string(10)
        sid = data.get("sid", None)
        gender = data.get("gender", None)
        date_of_birth = data.get("date_of_birth", None)
        major = data.get("major", None)
        admission_year = data.get("admission_year", None)

        if not (username and password and email and sid
                and gender and date_of_birth and major and admission_year):
            raise ValidationError({'result': False,
                                   'message': "Missing values."})
        r = re.match(r"^[a-z0-9_]{5,20}$", username)
        if r is None:
            raise ValidationError({'result': False,
                                   'message': "The username must be of length 5 to 20, "
                                              "and consist of lowercase alphabets, numbers, and _ only."})
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
            validate_birth(date_of_birth)
            validate_admission(admission_year)
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
            send_mail("Welcome to CUCrowd",
                      f"Dear {new_user.username},\n\n"
                      f"Thank you for signing up in CUCrowd. Your initial password is {password}.\n\n"
                      f"You can also change your password via the 'Forgot Password' function.\n\n"
                      f"Yours Sincerely,\nCUCrowd project team",
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

    # treat all full-update as partial update
    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
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

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated],
            name='get my profile')
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
    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated],
            name='get org user profile', url_path=r"org/(?P<username>[^\.=]+)")
    def org(self, request, username):
        profile = OrgUserProfile.objects.filter(user__username=username)
        if not profile:
            raise ValidationError({"result": False, "message": "Profile not found."})
        serializer = OrgProfileSerializer(profile[0], many=False)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated],
            name='get joining experiments', url_path=r"me/joining")
    def joining(self, request, *args, **kwargs):
        user = request.user
        joined = user.enrollment_set.all()
        serializer = EnrollmentPreviewSerializer(joined, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated],
            name='get hosting experiments', url_path=r"me/hosting")
    def hosting(self, request, *args, **kwargs):
        user = request.user
        hosted = user.experiment_set.all()
        serializer = ExperimentSerializer(hosted, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated],
            name='shows team application', url_path=r'me/team_application')
    def team_application(self, request, *args, **kwargs):
        user = request.user
        submitted_applications = user.teammates_set.all()
        serializer = TeamApplicationSerializer(submitted_applications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated],
            name='shows leading team', url_path=r'me/leading_team')
    def leading_team(self, request, *args, **kwargs):
        user = request.user
        leading_teams = user.teamformation_set.all()
        serializer = TeamPreviewSerializer(leading_teams, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated],
            name='get hosting questionnaire', url_path=r"me/hosting_questionnaire")
    def hosting_questionnaire(self, request, *args, **kwargs):
        user = request.user
        hosted = user.questionnaire_set.all()
        serializer = QuestionnaireSerializer(hosted, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated],
            name='get joining questionnaire', url_path=r"me/joining_questionnaire")
    def joining(self, request, *args, **kwargs):
        user = request.user
        joined = user.answer_set.all()
        serializer = AnswerSerializer(joined, many=True)
        return Response(serializer.data)

    # ref: https://stackoverflow.com/a/24420192/16418649
    @action(detail=False, methods=['POST'], permission_classes=[IsAuthenticated],
            name='upload profile avatar', url_path=r"upload")
    @parser_classes([MultiPartParser, FormParser])
    def upload(self, request, *args, **kwargs):
        user = request.user
        profile = self.queryset.filter(user=user)
        avatar = request.FILES.get('avatar', None)
        if avatar:
            fp = get_avatar_fp(profile[0], str(avatar))
            with open(os.path.join(MEDIA_ROOT, fp), 'wb+') as f:
                for chunk in avatar.chunks():
                    f.write(chunk)
            # update only work on queryset
        else:
            fp = None
        profile.update(avatar=fp)
        return Response({"result": True})

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
                    f"If you have not submitted a request to reset password, please ignore this email.\n\n" \
                    f"Yours Sincerely,\nCUCrowd project team"
    send_mail("Reset Password Email",
              email_message,
              EMAIL_HOST_USER,
              [user_email],
              fail_silently=False)
