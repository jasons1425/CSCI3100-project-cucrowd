from django.shortcuts import render
from django.core.exceptions import ValidationError as FieldValidationError
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from .serializers import ExperimentSerializer, EnrollmentSerializer
from .models import Experiment, Enrollment
from user_auth.serializers import StudentProfileSerializer


# Create your views here.
# permission control based on the action taken
# ref: https://stackoverflow.com/a/35987077/16418649
class ExperimentView(viewsets.ModelViewSet):
    serializer_class = ExperimentSerializer
    queryset = Experiment.objects.all()
    permission_classes_by_action = {
        'create': [IsAuthenticated],
        'list': [AllowAny],
        'retrieve': [AllowAny],
        'destroy': [IsAuthenticated],
        'update': [IsAuthenticated],
        'partial_update': [IsAuthenticated],
    }

    # referencing the method from the below website
    # https://ilovedjango.com/django/rest-api-framework/tips/save-foreign-key-using-django-rest-framework-create-method/
    # if the "host" field info is passed to the serializer via the data argument,
    #    that field will disappear when reaching the serializer.create() method due to unknown reasons
    def create(self, request, *args, **kwargs):
        host = request.user
        if host.is_org is False:
            raise ValidationError({"result": False, "message": "Only organization users can create experiments."})
        request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("host.") or key == "host":
                del request.data[key]
        request.data._mutable = False
        _serializer = self.serializer_class(data=request.data, context={"host": host})
        if _serializer.is_valid(raise_exception=True):
            self.perform_create(_serializer)
            return Response(data=_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("host.") or key == "host":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = False
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only experiment host can update the content."})
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only experiment host can destroy the content."})
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("host.") or key == "host":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = False
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only experiment host can edit the content."})
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=['GET'], name='get enrolled participants')
    def enrolled(self, request, pk):
        user = request.user
        exp = self.get_queryset().filter(pk=pk)
        if not exp:
            raise ValidationError({"result": False, "mesage": "Experiment not found."})
        exp = exp[0]
        if exp.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only experiment host can request participant info."})
        enrolled = exp.enrollment_set.all()
        serializer = EnrollmentSerializer(enrolled, many=True)
        return Response(serializer.data)

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]


class EnrollView(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    queryset = Enrollment.objects.all()
    permission_classes_by_action = {
        'create': [IsAuthenticated],
        'list': [IsAuthenticated],
        'retrieve': [IsAuthenticated],
        'destroy': [IsAuthenticated],
        'update': [IsAdminUser],
        'partial_update': [IsAdminUser],
    }

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

    def create(self, request, *args, **kwargs):
        participant = request.user
        data = request.data
        exp_id = data.get('experiment', None)
        if exp_id is None:
            raise ValidationError({"result": False, "message": "Missing experiment ID."})
        try:
            exp_obj = Experiment.objects.filter(id=request.data['experiment'])
            assert exp_obj.exists()
            exp_obj = exp_obj[0]
        except (FieldValidationError, AssertionError):
            raise ValidationError({"result": False, "message": "Experiment not found."})
        existing_exp_records = self.get_queryset().filter(experiment=exp_obj, participant=participant)
        if existing_exp_records.exists():
            raise ValidationError({"result": False, "message": "The current user already enrolled in the experiment"})
        _serializer = self.serializer_class(data=request.data,
                                            context={"participant": participant, "experiment": exp_obj})
        if _serializer.is_valid(raise_exception=False):
            self.perform_create(_serializer)
            return Response(data=_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        host = instance.experiment.host
        participant = instance.participant
        if user.id != host.id and user.id != participant.id:
            raise ValidationError({"result": False,
                                   "message": "Only experiment host and participant can cancel the enrollment."})
        return super().destroy(request, *args, **kwargs)
