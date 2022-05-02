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


# the view class responsible for the TeamFormation feature
class TeamView(viewsets.ModelViewSet):
    default_serializer_class = TeamPrivateDetailSerializer
    # provide profile preview info in the listing view
    serializer_classes = {
        'list': TeamPreviewSerializer
    }
    queryset = Teamformation.objects.all().order_by('-post_date')
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

    # permission control for each endpoint
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

    # endpoint responsible for team creation
    # /api/teamformation (POST)
    # github issue #50
    def create(self, request, *args, **kwargs):
        host = request.user  # user who submitted the request will be the team leader
        if host.is_org:
            # only student users can create a team
            raise ValidationError({"result": False, "message": "Only student users can create teams."})
        # to strip the host / members info attached in the request payload
        # this is to avoid attackers from creating teams for other users via direct API request
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("host.") or key == "host" or key.startswith("members.") or key == "members":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = False
        _serializer = self.get_serializer_class()(data=request.data, context={"host": host})
        if _serializer.is_valid(raise_exception=True):
            # create the team
            self.perform_create(_serializer)
            instance = self.queryset.get(id=_serializer.data['id'])
            # create the initial member (leader) of the team
            Teammates.objects.create(teamformation=instance, info=host, state="accepted")
            # re-fetch the instance to reflect he new member
            instance = self.queryset.get(id=_serializer.data['id'])
            _serializer = self.get_serializer_class()(instance, many=False)
            return Response(data=_serializer.data, status=status.HTTP_201_CREATED)
        else:
            # error catching due to field validation when creating teams
            return Response(data=_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # endpoint responsible for team details view
    # /api/teamformation/<team id> (GET)
    # github issue #50
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if instance.host.id is not user.id:
            # provide the public team view to non-host users
            #   which hides the pending team application data
            serializer = TeamPublicDetailSerializer(instance)
        else:
            # provide the private team view to host users
            #   which provides all team application data
            serializer = TeamPrivateDetailSerializer(instance)
        return Response(serializer.data)

    # endpoint responsible for the team listing view
    # /api/teamformation (GET)
    # github issue #50
    def list(self, request, *args, **kwargs):
        # only return the publishable team info
        open_team = self.get_queryset().filter(publishable=True)
        # for pagination response
        page = self.paginate_queryset(open_team)
        if page is not None:
            serializer = self.get_serializer_class()(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer_class()(open_team, many=True)
        return Response(serializer.data)

    # endpoint responsible for editing team
    # /api/teamformation/<team id> (POST)
    # github issue #51
    def update(self, request, *args, **kwargs):
        # treat all update as partial update (so that no need to attach all team fields info in the payload)
        kwargs['partial'] = True
        user = request.user
        instance = self.get_object()
        # to strip the host / members info attached in the request payload
        #   host user of the team cannot be altered, while members info can only be updated via other API
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("host.") or key == "host" or key.startswith("members.") or key == "members":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = False
        # only allow team host for editing
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only team host can edit the content."})
        return super().update(request, *args, **kwargs)

    # endpoint responsible for editing team
    # /api/teamformation/<team id> (PUT/PATCH)
    # github issue #51
    def partial_update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        # to strip the host / members info attached in the request payload
        #   host user of the team cannot be altered, while members info can only be updated via other API
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("host.") or key == "host" or key.startswith("members.") or key == "members":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = False
        # only allow team host for editing
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only team host can edit the content."})
        return super().partial_update(request, *args, **kwargs)

    # endpoint responsible for deleting team
    # /api/teamformation/<team id> (DELETE)
    # github issue #51
    def destroy(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        # only team host can delete the post
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only team host can delete the post."})
        return super().destroy(request, *args, **kwargs)

    # endpoint responsible for updating the team application status
    # /api/teamformation/<team id>/update_state (POST)
    # github issue #52
    @action(detail=True, methods=['POST'], permission_classes=[IsAuthenticated],
            name='update application status', url_path=r"update_state")
    def update_status(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        if instance.host.id is not user.id:
            # only allow team host to manage the team application
            raise ValidationError({"result": False, "message": "Only team host can change application status."})
        application_id = request.data.get('id', None)
        application = instance.teammates_set.filter(id=application_id)
        if not application:
            # check if the target application does exist in DB
            raise ValidationError({"result": False, "message": "Application not found."})
        application = application[0]  # the matching application in the queryset
        new_state = request.data.get('state', None)
        if not new_state:
            # missing value in the request payload
            raise ValidationError({"result": False, "message": "Missing new state for the application."})
        team_vacancies = instance.teamsize
        taken_places = len(Teammates.objects.filter(teamformation=instance, state="accepted"))
        if taken_places >= team_vacancies and new_state == "accepted":
            raise ValidationError({"result": False,
                                   "message": "The team is full."})
        if application.info.id == user.id:
            raise ValidationError({"result": False,
                                   "message": "Team host cannot change his/her own application state."})
        try:
            # queryset.update() method will not do the choice checking,
            #   need to directly call the full_clean method
            application.state = new_state
            application.full_clean()
            application.save()
        except FieldValidationError as e:
            # attempts to set invalid state for the application
            raise ValidationError({"result": False, "message": f"{e.args}"})
        return Response({"result": True})

    # endpoint responsible for sending application to join the team
    # /api/teamformation/<team id>/apply (POST)
    # github issue #52
    @action(detail=True, methods=['POST'], permission_classes=[IsAuthenticated],
            name='apply to join the team', url_path=r'apply')
    def apply(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.deadline < date.today():
            # the team is not open for application anymore
            raise ValidationError({"result": False, "message": "The team recruitment has expired."})
        if not instance.publishable:
            # the team is not open for application anymore
            raise ValidationError({"result": False, "message": "The team is not open for application anymore."})
        # the user applying to join the team
        user = request.user
        if user.is_org:
            # only student users can join a team
            raise ValidationError({"result": False, "message": "Only student users can apply for joining the team."})
        existing_application = Teammates.objects.filter(teamformation=instance, info=user)
        if existing_application:
            # prevent multiple ongoing application to join the same team by the same user
            raise ValidationError({"result": False,
                                   "message": "You have already applied to join this team."})
        team_vacancies = instance.teamsize
        taken_places = len(Teammates.objects.filter(teamformation=instance, state="accepted"))
        if taken_places >= team_vacancies:
            raise ValidationError({"result": False,
                                   "message": "The team is full."})
        application = Teammates.objects.create(teamformation=instance, info=user)
        if not application:
            # unknown error - fail to create a new team for some reasons
            raise ValidationError({"result": False,
                                   "message": "Fail to submit the application. Please contact system admin."})
        team_title = instance.title
        host = instance.host
        if getattr(user, "stu_profile", None):
            # get the student profile of the member (if have)
            profile = user.stu_profile
            field1 = ('admission year', profile.admission_year)
            field2 = ('major', profile.major)
        else:
            field1 = ('admission year', None)
            field2 = ('major', None)
        # notify the team host about the new application to team
        send_mail(f"New application for your team '{team_title}'",
                  f"Dear {host.username},\n\n"
                  f"Your have received a new application for your team '{team_title}'.\n\n"
                  f"name: {user.username:<100}\n"
                  f"{field1[0]}: {field1[1]}\n"
                  f"{field2[0]}: {field2[1]}\n\n"
                  f"Yours Sincerely,\nCUCrowd Project team",
                  EMAIL_HOST_USER,
                  [host.email],
                  fail_silently=False)
        return Response({"result": True})

    # endpoint responsible for applicants to withdraw their application
    # /api/teamformation/<team id>/cancel_application (POST)
    # github issue #52
    @action(detail=True, methods=['POST'], permission_classes=[IsAuthenticated],
            name='cancel application', url_path=r'cancel_application')
    def cancel_application(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        existing_application = Teammates.objects.filter(teamformation=instance, info=user)
        if not existing_application:
            # the user must have a submitted application for the target team
            raise ValidationError({"result": False, "message": "You have not applied to join this team."})
        if instance.host.id is user.id:
            # only the applicant can withdraw their application
            raise ValidationError({"result": False,
                                   "message": "Team leader cannot quit the team. Please disband the team instead."})
        existing_application[0].delete()
        return Response({"result": True})



