import uuid
from django.db import models
from datetime import date
from django.conf import settings
from django.core.exceptions import ValidationError as FieldValidationError
import os
from urllib.parse import urlparse


def get_team_fp(instance, filename):
    ext = filename.split('.')[-1]
    return os.path.join("team", f"{instance.id}.") + ext


def validate_deadline(value):
    if value < date.today():
        raise FieldValidationError("The date cannot be in the past!")
    return value


def validate_size(value):
    if value <= 1:
        raise FieldValidationError(
            '%(value)s is not an validate number, it is too small.',
            params={'value': value}
        )
    if value > 5:
        raise FieldValidationError(
            '%(value)s is not an validate number, it is too large.',
            params={'value': value}
        )


def validate_url(value):
    if len(value) > 0:
        try:
            result = urlparse(value)
            if not all([result.scheme, result.netloc]):
                raise AssertionError
        except Exception as e:
            raise FieldValidationError("Invalid URL. Expected format to be `https://...`")
    return value


# configuration of the Team model in DB
class Teamformation(models.Model):
    id = models.UUIDField(primary_key=True,
                          default=uuid.uuid4,editable=False)
    title = models.CharField(max_length=200,default = "Please type the title here.",  help_text="Please enter the title",
                             null=False, blank=False)
    host = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             null=False, blank=True, editable=False)
    self_intro = models.TextField(max_length=500, default = "Please type something about yourself here.",
                                  help_text="Please type a short self-introduction.(around 100 words)",
                                  null=False, blank=False)
    description = models.TextField(max_length=5000, default = "Please type the description here.",
                                   help_text="Please type a short description.(around 200 words)",
                                   null=False, blank=False)
    requirements = models.TextField(max_length=200, default = "Please type the requirements here.",
                                    help_text="Please type your requirements that team members need.(around 100 words)",
                                    null=False, blank=False)
    link = models.TextField(max_length=200 , default = "Please type the links here.",
                            help_text="Please enter the links that you need.(if available)",
                            validators=[validate_url], null=True, blank=True)
    contact = models.TextField(max_length=200, default = "Please type the contact here.",
                               help_text="Please type your contact. (Email , Phone number, etc...)",
                               null=False, blank=False)
    deadline = models.DateField(validators=[validate_deadline], default=date.today)
    teamsize = models.IntegerField(validators=[validate_size], default = "Please type the teamsize here.",
                                   help_text="Please enter an integer number. (Minimum is 2 and Maximum is 5)",
                                   null=False, blank=False)
    publishable = models.BooleanField(default=True, null=False, blank=False)

    post_date = models.DateField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


# configuration of the Teammate model in DB
class Teammates(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    info = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             null=False, blank=False)
    teamformation = models.ForeignKey(Teamformation, default="",
                                      on_delete=models.CASCADE,
                                      null=False, blank=False)
    state = models.CharField(
        max_length=10,
        choices=[
            ('pending', 'pending'),
            ('accepted', 'accepted'),
            ('rejected', 'rejected')
        ],
        default='pending',
        null=False,
        blank=False
    )

    def __str__(self):
        return self.info.username

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

        
