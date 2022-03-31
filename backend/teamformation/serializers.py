from rest_framework import serializers
from django.core.exceptions import ValidationError as FieldValidationError
from rest_framework.exceptions import ValidationError
from .models import Teammates, Teamformation
from user_auth.serializers import CrowdUserSerializer


class TeamformationSerializer(serializers.ModelSerializer):
    host = CrowdUserSerializer(many=False, required=False, allow_null=True)

    def create(self, validated_data):
        if self.context.get("host", None):
            host = self.context['host']
            validated_data['host'] = host
        teamformation = teamformation.objects.create(**validated_data)
        return teamformation

    class Meta:
        model = Teamformation
        fields = ["id", "title","host", "self_intro", "description",
                  "requirements", "link", "contact", "deadline", "post_date",
                  "last_modified", "teamsize", "teammember", "team_img"]

class TeammatesSerializer(serializers.ModelSerializer):
    teaminfo = CrowdUserSerializer(many=False, required=False, allow_null=True)

    def create(self, validated_data):
        if self.context.get("info", None):
            info = self.context['info']
            validated_data['info'] = info
        if self.context.get("teamformation", None):
            tfm_obj = self.context['teamformation']
            validated_data['teamformation'] = tfm_obj
        try:
            teammates = Teammates.objects.create(**validated_data)
        except FieldValidationError as e:
            raise ValidationError({"result": False, "message": f"{e.args}"})
        return teammates

    class Meta:
        model = Teammates
        fields = ["id", "info", "teamformation"]

