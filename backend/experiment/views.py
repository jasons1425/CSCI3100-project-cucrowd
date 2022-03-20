from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from .serializers import ExperimentSerializer
from .models import Experiment


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
        _serializer = self.serializer_class(data=request.data, context={"host": host})
        if _serializer.is_valid(raise_exception=True):
            self.perform_create(_serializer)
            return Response(data=_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        data = request.data
        if data.get('host', None):
            del data['host']
        request.data.update(data)
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only experiment host can update the content."})
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        data = request.data
        if data.get('host', None):
            del data['host']
        request.data.update(data)
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only experiment host can destroy the content."})
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        data = request.data
        if data.get('host', None):
            del data['host']
        request.data.update(data)
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only experiment host can edit the content."})
        return super().update(request, *args, **kwargs)

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]

