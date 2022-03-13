from rest_framework import serializers
from .models import Experiment
from user_auth.serializers import CrowdUserSerializer


class ExperimentSerializer(serializers.ModelSerializer):
    host = CrowdUserSerializer(many=False)

    def create(self, validated_data):
        if self.context['host']:
            host = self.context['host']
            validated_data['host'] = host
        experiment = Experiment.objects.create(**validated_data)
        return experiment

    class Meta:
        model = Experiment
        fields = "__all__"
