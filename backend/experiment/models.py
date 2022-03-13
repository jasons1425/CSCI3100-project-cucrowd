from django.db import models
from django.contrib.auth.models import AnonymousUser
from django.conf import settings


# Create your models here.
class Experiment(models.Model):
    host = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             null=False, blank=True, editable=False)
    title = models.CharField(max_length=120)
    description = models.TextField(max_length=1000)

    def __str__(self):
        return self.title
