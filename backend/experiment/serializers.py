from rest_framework import serializers
from .models import Experiment
from user_auth.serializers import CrowdUserSerializer


class ExperimentSerializer(serializers.ModelSerializer):
    host = CrowdUserSerializer(many=False, required=False, allow_null=True)

    def create(self, validated_data):
        if self.context['host']:
            host = self.context['host']
            validated_data['host'] = host
        experiment = Experiment.objects.create(**validated_data)
        return experiment

    class Meta:
        model = Experiment
        fields = ["id", "host", "title", "subtitle", "target",
                  "job_nature", "type", "duration", "salary", "venue",
                  "deadline", "vacancy", "description"]

