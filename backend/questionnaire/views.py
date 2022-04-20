import datetime
from django.shortcuts import render
from django.core.exceptions import ValidationError as FieldValidationError
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from .serializers import QuestionnaireSerializer, AnswerSerializer
from .models import Questionnaire, Answer
from datetime import date


# Create your views here.
class QuestionnaireView(viewsets.ModelViewSet):
    serializer_class = QuestionnaireSerializer
    queryset = Questionnaire.objects.all()
    permission_classes_by_action = {
        'create': [IsAuthenticated],
        'list': [AllowAny],
        'retrieve': [AllowAny],
        'destroy': [IsAuthenticated],
        'update': [IsAuthenticated],
        'partial_update': [IsAuthenticated],
    }

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
            if key.startswith("host.") or key == "host":
                del request.data[key]
        if type(request.data) is not dict:  # i.e. is immutable QueryDict
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
            raise ValidationError({"result": False, "message": "Only questionnaire host can update the content."})
        return super().partial_update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        if instance.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only questionnaire host can destroy the content."})
        return super().destroy(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
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
            raise ValidationError({"result": False, "message": "Only questionnaire host can edit the content."})
        return super().update(request, *args, **kwargs)
    
    @action(detail=True, methods=['GET'], permission_classes=[IsAuthenticated],
            name='get answer')
    def answered(self, request, pk):
        user = request.user
        question = self.get_queryset().filter(pk=pk)
        if not question:
            raise ValidationError({"result": False, "mesage": "Questionnaire not found."})
        question = question[0]
        if question.host.id is not user.id:
            raise ValidationError({"result": False, "message": "Only questionnaire host can request respondent info."})
        answered = question.answer_set.all()
        serializer = AnswerSerializer(answered, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], permission_classes=[AllowAny],
            name='get ongoing questionnaires', url_path='ongoing')
    def ongoing(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(deadline__gte=datetime.date.today())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class AnswerView(viewsets.ModelViewSet):
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()
    permission_classes_by_action = {
        'create': [IsAuthenticated],
        'list': [IsAdminUser],
        'retrieve': [IsAdminUser],
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
        respondent = request.user
        data = request.data
        question_id = data.get('questionnaire', None)
        if respondent.is_org:
            raise ValidationError({"result": False, "message": "Only student users can answer the questionnaire."})
        if question_id is None:
            raise ValidationError({"result": False, "message": "Missing questionnaire ID."})
        try:
            question_obj = Questionnaire.objects.filter(id=request.data['questionnaire'])
            assert question_obj.exists()
            question_obj = question_obj[0]
        except (FieldValidationError, AssertionError):
            raise ValidationError({"result": False, "message": "Questionnaire not found."})
        existing_question_records = self.get_queryset().filter(questionnaire=question_obj, respondent=respondent)
        if existing_question_records.exists():
            raise ValidationError({"result": False, "message": "The current user already answer the questionnaire"})
        _serializer = self.serializer_class(data=request.data,
                                            context={"respondent": respondent, "questionnaire": question_obj})
        
        if _serializer.is_valid(raise_exception=False):
            self.perform_create(_serializer)
            return Response(data=_serializer.data, status=status.HTTP_201_CREATED)
        else:
            err_dict = _serializer.errors
            err_msg = [str(err_dict[k][0]) for k in err_dict]
            raise ValidationError({"result": False, "message": '; '.join(err_msg)})

    def destroy(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        host = instance.questionnaire.host
        respondent = instance.respondent
        if user.id != host.id and user.id != respondent.id:
            raise ValidationError({"result": False,
                                   "message": "Only questionnaire host and respondent can cancel the answer."})
        res = super().destroy(request, *args, **kwargs)
        return res
