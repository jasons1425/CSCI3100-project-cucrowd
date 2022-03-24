from rest_framework import serializers
from .models import CrowdUser, StudentProfile, OrgUserProfile


class CrowdUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrowdUser
        fields = ["id", "username", "email"]


class StudentProfileSerializer(serializers.ModelSerializer):
    user = CrowdUserSerializer(many=False)

    class Meta:
        model = StudentProfile
        fields = ["user", "gender", "date_of_birth", "avatar",
                  "sid", "major", "admission_year"]


class OrgProfileSerializer(serializers.ModelSerializer):
    user = CrowdUserSerializer(many=False)

    class Meta:
        model = OrgUserProfile
        fields = ["user", "gender", "date_of_birth", "avatar", "org_name"]
