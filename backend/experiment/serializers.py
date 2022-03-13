from rest_framework import serializers
from .models import Experiment


class ExperimentSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        if self.context['host']:
            host = self.context['host']
            validated_data['host'] = host
        experiment = Experiment.objects.create(**validated_data)
        return experiment

    class Meta:
        model = Experiment
        fields = "__all__"
