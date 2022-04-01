from rest_framework import serializers
from django.core.exceptions import ValidationError as FieldValidationError, ObjectDoesNotExist
from rest_framework.exceptions import ValidationError
from .models import Teammates, Teamformation
from user_auth.serializers import CrowdUserSerializer, StudentProfileSerializer, \
    OrgProfileSerializer, StudentPreviewSerializer, OrgPreviewSerializer


class TeammateSerializer(serializers.ModelSerializer):
    info = serializers.SerializerMethodField()

    class Meta:
        model = Teammates
        fields = ["id", "info", "state"]

    def get_info(self, mate):
        mate = mate.info
        try:
            if mate.is_org:
                profile = mate.org_profile
                return OrgProfileSerializer(profile, many=False).data
            else:
                profile = mate.stu_profile
                return StudentProfileSerializer(profile, many=False).data
        except ObjectDoesNotExist:
            return None   # No profile found


class TeammatePreviewSerializer(serializers.ModelSerializer):
    info = serializers.SerializerMethodField()

    class Meta:
        model = Teammates
        fields = ["info"]

    def get_info(self, mate):
        mate = mate.info
        try:
            if mate.is_org:
                profile = mate.org_profile
                return OrgPreviewSerializer(profile, many=False).data
            else:
                profile = mate.stu_profile
                return StudentPreviewSerializer(profile, many=False).data
        except ObjectDoesNotExist:
            return None   # No profile found


class TeamDetailSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()
    host = CrowdUserSerializer(many=False, required=False, allow_null=True)

    def create(self, validated_data):
        if self.context.get("host", None):
            host = self.context['host']
            validated_data['host'] = host
        experiment = Teamformation.objects.create(**validated_data)
        return experiment

    class Meta:
        model = Teamformation
        fields = ["id", "title", "host", "self_intro", "description",
                  "requirements", "link", "contact", "deadline", "teamsize",
                  "publishable", "post_date", "members"]

    def get_members(self, team):
        applicants = team.teammates_set.all()
        return TeammateSerializer(applicants, many=True).data


class TeamPreviewSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()

    class Meta:
        model = Teamformation
        fields = ["id", "title", "teamsize", "deadline", "requirements",
                  "members"]

    def get_members(self, team):
        applicants = team.teammates_set.filter(state="accepted")
        return TeammatePreviewSerializer(applicants, many=True).data
