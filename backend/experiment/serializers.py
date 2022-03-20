from rest_framework import serializers
from .models import Experiment, Enrollment
from user_auth.serializers import CrowdUserSerializer


class ExperimentSerializer(serializers.ModelSerializer):
    host = CrowdUserSerializer(many=False, required=False, allow_null=True)

    def create(self, validated_data):
        if self.context.get("host", None):
            host = self.context['host']
            validated_data['host'] = host
        experiment = Experiment.objects.create(**validated_data)
        return experiment

    class Meta:
        model = Experiment
        fields = ["id", "host", "title", "subtitle", "target",
                  "job_nature", "type", "duration", "salary", "venue",
                  "deadline", "vacancy", "description"]


class EnrollmentSerializer(serializers.ModelSerializer):
    participant = CrowdUserSerializer(many=False, required=False, allow_null=True)

    def create(self, validated_data):
        if self.context.get("participant", None):
            participant = self.context['participant']
            validated_data['participant'] = participant
        if self.context.get("experiment", None):
            exp_obj = self.context['experiment']
            validated_data['experiment'] = exp_obj
        enrollment = Enrollment.objects.create(**validated_data)
        return enrollment

    class Meta:
        model = Enrollment
        fields = ["id", "experiment", "participant", "selected_time"]
