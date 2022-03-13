from rest_framework import serializers
from .models import CrowdUser


class CrowdUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrowdUser
        fields = ("username", )
