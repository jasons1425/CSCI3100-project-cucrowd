from rest_framework import serializers
from .models import CrowdUser, StudentProfile, OrgUserProfile


# serializer class for all user
class CrowdUserSerializer(serializers.ModelSerializer):
    identity = serializers.SerializerMethodField()

    class Meta:
        model = CrowdUser
        fields = ["username", "email", "identity"]

    def get_identity(self, user):
        if user.is_org:
            return "organization user"
        return "student user"


# serializer class for student profile details
class StudentProfileSerializer(serializers.ModelSerializer):
    user = CrowdUserSerializer(many=False)

    class Meta:
        model = StudentProfile
        fields = ["user", "gender", "date_of_birth",
                  "sid", "major", "admission_year", 'avatar']


# serializer class for student profile preview
class StudentPreviewSerializer(serializers.ModelSerializer):
    user = CrowdUserSerializer(many=False)

    class Meta:
        model = StudentProfile
        fields = ["user", "major", "sid", "admission_year", "avatar"]


# serializer class for org user profile details
class OrgProfileSerializer(serializers.ModelSerializer):
    user = CrowdUserSerializer(many=False)

    class Meta:
        model = OrgUserProfile
        fields = "__all__"


# serializer class for org user profile preview
class OrgPreviewSerializer(serializers.ModelSerializer):
    user = CrowdUserSerializer(many=False)

    class Meta:
        model = OrgUserProfile
        fields = ["user", "org_name", "org_url", "avatar"]
