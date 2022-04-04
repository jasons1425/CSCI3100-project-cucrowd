from rest_framework import serializers
from django.core.exceptions import ValidationError as FieldValidationError
from rest_framework.exceptions import ValidationError
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
        fields = ["id", "host", "title", "subtitle", "target", "exp_img",
                  "job_nature", "type", "duration", "salary", "venue", "post_date",
                  "deadline", "vacancy", "description", "timeslots", "requirements"]


class ExperimentPreviewSerializer(serializers.ModelSerializer):
    host = CrowdUserSerializer(many=False)

    class Meta:
        model = Experiment
        fields = ["id", "title", "host", "deadline"]


class EnrollmentSerializer(serializers.ModelSerializer):
    participant = CrowdUserSerializer(many=False, required=False, allow_null=True)

    def create(self, validated_data):
        if self.context.get("participant", None):
            participant = self.context['participant']
            validated_data['participant'] = participant
        if self.context.get("experiment", None):
            exp_obj = self.context['experiment']
            validated_data['experiment'] = exp_obj
        try:
            enrollment = Enrollment.objects.create(**validated_data)
        except FieldValidationError as e:
            raise ValidationError({"result": False, "message": f"{e.args}"})
        return enrollment

    class Meta:
        model = Enrollment
        fields = ["id", "experiment", "participant", "selected_time"]


class EnrollmentPreviewSerializer(serializers.ModelSerializer):
    participant = CrowdUserSerializer(many=False)
    experiment = ExperimentPreviewSerializer(many=False)

    class Meta:
        model = Enrollment
        fields = ["id", "experiment", "participant", "selected_time"]
