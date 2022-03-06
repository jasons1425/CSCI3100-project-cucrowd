from rest_framework import serializers
from .models import Experiment


class ExperimentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experiment
        fields = ("id", "host", "title", "description")
