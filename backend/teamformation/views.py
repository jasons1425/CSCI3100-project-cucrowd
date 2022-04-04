from django.shortcuts import render
from django.core.exceptions import ValidationError as FieldValidationError
from django.core.mail import send_mail
from backend.settings import EMAIL_HOST_USER
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from .serializers import TeamPrivateDetailSerializer, TeamPreviewSerializer, TeamPublicDetailSerializer
from .models import Teamformation, Teammates
from datetime import date


# Create your views here.
class TeamView(viewsets.ModelViewSet):
    default_serializer_class = TeamPrivateDetailSerializer
    serializer_classes = {
        'list': TeamPreviewSerializer
    }
    queryset = Teamformation.objects.all()
    permission_classes_by_action = {
        'create': [IsAuthenticated],
        'list': [AllowAny],
        'retrieve': [AllowAny],
        'destroy': [IsAuthenticated],
        'update': [IsAuthenticated],
        'partial_update': [IsAuthenticated],
    }

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

    def create(self, request, *args, **kwargs):
        host = request.user
        if host.is_org:
            raise ValidationError({"result": False, "message": "Only student users can create questionnaires."})
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("host.") or key == "host" or key.startswith("members.") or key == "members":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = False
        _serializer = self.get_serializer_class()(data=request.data, context={"host": host})
        if _serializer.is_valid(raise_exception=True):
            self.perform_create(_serializer)
            instance = self.queryset.get(id=_serializer.data['id'])
            Teammates.objects.create(teamformation=instance, info=host, state="accepted")  # create the initial member (leader) of the team
            instance = self.queryset.get(id=_serializer.data['id'])  # re-fetch the instance to reflect he new member
            _serializer = self.get_serializer_class()(instance, many=False)
            return Response(data=_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if instance.host.id is not user.id:
            serializer = TeamPublicDetailSerializer(instance)
        else:
            serializer = TeamPrivateDetailSerializer(instance)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        open_team = self.get_queryset().filter(publishable=True)
        page = self.paginate_queryset(open_team)
        if page is not None:
            serializer = self.get_serializer_class()(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer_class()(open_team, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        user = request.user
        instance = self.get_object()
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("host.") or key == "host" or key.startswith("members.") or key == "members":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = False
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only team host can edit the content."})
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("host.") or key == "host" or key.startswith("members.") or key == "members":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = False
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only team host can edit the content."})
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only team host can delete the post."})
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['POST'], permission_classes=[IsAuthenticated],
            name='update application status', url_path=r"update_state")
    def update_status(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only team host can change application status"})
        application_id = request.data.get('id', None)
        application = instance.teammates_set.filter(id=application_id)
        if not application:
            raise ValidationError({"result": False, "message": "Application not found."})
        application = application[0]
        new_state = request.data.get('state', None)
        if not new_state:
            raise ValidationError({"result": False, "message": "Missing new state for the application."})
        try:
            # queryset.update() method will not do the choice checking,
            #   need to directly call the full_clean method
            application.state = new_state
            application.full_clean()
            application.save()
        except FieldValidationError as e:
            raise ValidationError({"result": False, "message": f"{e.args}"})
        return Response({"result": True})

    @action(detail=True, methods=['POST'], permission_classes=[IsAuthenticated],
            name='apply to join the team', url_path=r'apply')
    def apply(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.deadline < date.today():
            raise ValidationError({"result": False, "message": "The team recruitment has expired."})
        if not instance.publishable:
            raise ValidationError({"result": False, "message": "The team is not open for application anymore."})
        user = request.user
        if user.is_org:
            raise ValidationError({"result": False, "message": "Only student users can apply for joining the team."})
        existing_application = Teammates.objects.filter(teamformation=instance, info=user)
        if existing_application:
            raise ValidationError({"result": False,
                                   "message": "You have already applied to join this team."})
        application = Teammates.objects.create(teamformation=instance, info=user)
        if not application:
            raise ValidationError({"result": False,
                                   "message": "Fail to submit the application. Please contact system admin."})
        team_title = instance.title
        host = instance.host
        if user.is_org:
            profile = user.org_profile
            field1 = ('organization name', profile.org_name)
            field2 = ('organization URL', profile.org_url)
        else:
            profile = user.stu_profile
            field1 = ('admission year', profile.admission_year)
            field2 = ('major', profile.major)
        send_mail(f"New application for your team '{team_title}'",
                  f"Dear {host.username},\n"
                  f"Your have received a new application for your team '{team_title}'.\n"
                  f"name: {user.username:<100}\n"
                  f"{field1[0]}: {field1[1]}\n"
                  f"{field2[0]}: {field2[1]}\n\n"
                  f"Regards, CU Crowd Project team",
                  EMAIL_HOST_USER,
                  [host.email],
                  fail_silently=False)
        return Response({"result": True})

    @action(detail=True, methods=['POST'], permission_classes=[IsAuthenticated],
            name='cancel application', url_path=r'cancel_application')
    def cancel_application(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        existing_application = Teammates.objects.filter(teamformation=instance, info=user)
        if not existing_application:
            raise ValidationError({"result": False, "message": "You have not applied to join this team."})
        if instance.host.id is user.id:
            raise ValidationError({"result": False,
                                   "message": "Team leader cannot quit the team. Please disband the team instead."})
        existing_application[0].delete()
        return Response({"result": True})



