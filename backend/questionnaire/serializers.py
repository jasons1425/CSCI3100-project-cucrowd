from rest_framework import serializers
from django.core.exceptions import ValidationError as FieldValidationError
from rest_framework.exceptions import ValidationError
from .models import Questionnaire, Answer
from user_auth.serializers import CrowdUserSerializer

#QuestionnaireSerializer
class QuestionnaireSerializer(serializers.ModelSerializer):
    host = CrowdUserSerializer(many=False, required=False, allow_null=True)

    def create(self, validated_data):
        if self.context.get("host", None):
            host = self.context['host']
            validated_data['host'] = host
        questionnaire = Questionnaire.objects.create(**validated_data)
        return questionnaire

    class Meta:
        model = Questionnaire
        fields = ["id", "title", "host", "description", "deadline", "post_date",
                  "last_modified", "questionsize", "questiontype", "question", "publishable","exp_finish"]

#QuestionnairePreviewSerializer
class QuestionnairePreviewSerializer(serializers.ModelSerializer):
    host = CrowdUserSerializer(many=False)

    class Meta:
        model = Questionnaire
        fields = ["id", "title", "host", "deadline"]

#AnswerSerializer
class AnswerSerializer(serializers.ModelSerializer):
    respondent = CrowdUserSerializer(many=False, required=False, allow_null=True)

    def create(self, validated_data):
        if self.context.get("respondent", None):
            respondent = self.context['respondent']
            validated_data['respondent'] = respondent
        if self.context.get("questionnaire", None):
            question_obj = self.context['questionnaire']
            validated_data['questionnaire'] = question_obj
        try:
            answer = Answer.objects.create(**validated_data)
        except FieldValidationError as e:
            raise ValidationError({"result": False, "message": f"{e.args}"})
        return answer

    class Meta:
        model = Answer
        fields = ["id", "questionnaire", "respondent", "Ans"]

#AnswerPreviewSerializer
class AnswerPreviewSerializer(serializers.ModelSerializer):
    respondent = CrowdUserSerializer(many=False)
    questionnaire = QuestionnairePreviewSerializer(many=False)

    class Meta:
        model = Answer
        fields = ["id", "questionnaire", "respondent", "Ans"]
