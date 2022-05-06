from rest_framework import serializers
from django.core.exceptions import ValidationError as FieldValidationError, ObjectDoesNotExist
from rest_framework.exceptions import ValidationError
from .models import Teammates, Teamformation
from user_auth.serializers import CrowdUserSerializer, StudentProfileSerializer, \
    OrgProfileSerializer, StudentPreviewSerializer, OrgPreviewSerializer


# serializer class of teammate profile details
class TeammateSerializer(serializers.ModelSerializer):
    # provide different info according to the account type of the teammate
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


# serializer class of teammate profile preview
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


# serializer class of team details view for team hosts
class TeamPrivateDetailSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()
    host = CrowdUserSerializer(many=False, required=False, allow_null=True)

    def create(self, validated_data):
        # assign the requesting user as the team host upon creating
        #   this is to prevent admins / users from creating teams in others' names
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

    # return all applicants
    def get_members(self, team):
        applicants = team.teammates_set.all()
        return TeammateSerializer(applicants, many=True).data


# serializer class of team details view for public users
class TeamPublicDetailSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()
    host = CrowdUserSerializer(many=False, required=False, allow_null=True)

    def create(self, validated_data):
        # assign the requesting user as the team host upon creating
        #   this is to prevent admins / users from creating teams in others' names
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

    # return only accepted applicants
    def get_members(self, team):
        applicants = team.teammates_set.filter(state="accepted")[::-1]
        return TeammatePreviewSerializer(applicants, many=True).data


# serializer class of team listing preview for all users
class TeamPreviewSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()

    class Meta:
        model = Teamformation
        fields = ["id", "title", "teamsize", "deadline", "requirements",
                  "description", "members"]

    # only return accepted applicants
    def get_members(self, team):
        applicants = team.teammates_set.filter(state="accepted")
        return TeammatePreviewSerializer(applicants, many=True).data


# serializer class of team application view for host users
class TeamApplicationSerializer(serializers.ModelSerializer):
    team = TeamPreviewSerializer(many=False, source="teamformation")
    applicant = CrowdUserSerializer(many=False, source="info")

    class Meta:
        model = Teammates
        fields = ["id", "applicant", "team"]
