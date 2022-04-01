from django.shortcuts import render
from django.core.exceptions import ValidationError as FieldValidationError
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from .serializers import TeamDetailSerializer, TeamPreviewSerializer, TeammateSerializer
from .models import Teamformation, Teammates


# Create your views here.
class TeamView(viewsets.ModelViewSet):
    default_serializer_class = TeamDetailSerializer
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
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = True
        for key in list(request.data.keys()):
            if key.startswith("host.") or key == "host" or key == "publishable" or key == "members":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
            request.data._mutable = False
        _serializer = self.get_serializer_class()(data=request.data, context={"host": host})
        if _serializer.is_valid(raise_exception=True):
            self.perform_create(_serializer)
            return Response(data=_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
            if key.startswith("host.") or key == "host" or key == "publishable" or key == "members":
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
            if key.startswith("host.") or key == "host" or key == "publishable" or key == "members":
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
