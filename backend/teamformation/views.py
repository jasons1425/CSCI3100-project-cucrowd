from django.shortcuts import render
from django.core.exceptions import ValidationError as FieldValidationError
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from .serializers import TeamformationSerializer, TeammatesSerializer
from .models import Teamformation, Teammates

# Create your views here.

class TeamformationView(viewsets.ModelViewSet):
    serializer_class = TeamformationSerializer
    queryset = Teamformation.objects.all()
    permission_classes_by_action = {
        'create': [IsAuthenticated],
        'list': [IsAdminUser],
        'retrieve': [IsAdminUser],
        'destroy': [IsAuthenticated],
        'update': [IsAdminUser],
        'partial_update': [IsAdminUser],
    }

class TeammatesView(viewsets.ModelViewSet):
    serializer_class = TeammatesSerializer
    queryset = Teammates.objects.all()
    permission_classes_by_action = {
        'create': [IsAuthenticated],
        'list': [IsAdminUser],
        'retrieve': [IsAdminUser],
        'destroy': [IsAuthenticated],
        'update': [IsAdminUser],
        'partial_update': [IsAdminUser],
    }
