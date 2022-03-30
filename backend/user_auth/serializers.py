from rest_framework import serializers
from .models import CrowdUser, StudentProfile, OrgUserProfile


class CrowdUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrowdUser
        fields = ["username", "email"]


class StudentProfileSerializer(serializers.ModelSerializer):
    user = CrowdUserSerializer(many=False)

    class Meta:
        model = StudentProfile
        fields = ["user", "gender", "date_of_birth",
                  "sid", "major", "admission_year", 'avatar']


class OrgProfileSerializer(serializers.ModelSerializer):
    user = CrowdUserSerializer(many=False)

    class Meta:
        model = OrgUserProfile
        fields = "__all__"
