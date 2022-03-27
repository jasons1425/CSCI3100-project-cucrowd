from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.exceptions import ValidationError
import os
import uuid


def get_avatar_fp(instance, filename):
    return os.path.join("avatar", f"{instance.user.username}_") + filename


class CrowdUser(AbstractUser):
    is_org = models.BooleanField(default=False, null=False, blank=False)


def validate_sid(value):
    if not isinstance(value, str):
        raise ValidationError("Expect SID to be in string type.")
    if not(len(value) == 10 and value.isdigit()):
        raise ValidationError("SID should consist of exactly 10 digits.")
    return True


class StudentProfile(models.Model):
    # general account details
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE,
                                null=False, blank=False, primary_key=True,
                                related_name="stu_profile")
    avatar = models.ImageField(upload_to=get_avatar_fp, null=True, blank=True)
    gender = models.CharField(
        max_length=2,
        choices=[
            ('M', "male"),
            ('F', "female"),
            ("NA", "others"),
        ],
        default="NA",
        null=False,
        blank=False
    )
    date_of_birth = models.DateField(null=False, blank=False)

    # student user related
    sid = models.CharField(max_length=10, validators=[validate_sid],
                           null=False, blank=False)
    major = models.CharField(max_length=50,
                             null=False, blank=False)
    admission_year = models.DateField(null=False, blank=False)

    def __str__(self):
        return self.user.username


class OrgUserProfile(models.Model):
    # general account details
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE,
                                null=False, blank=False, primary_key=True,
                                related_name="org_profile")
    avatar = models.ImageField(upload_to=get_avatar_fp, null=True, blank=True)
    gender = models.CharField(
        max_length=2,
        choices=[
            ('M', "male"),
            ('F', "female"),
            ("NA", "others"),
        ],
        default="NA",
        null=False,
        blank=False
    )
    date_of_birth = models.DateField(null=True, blank=True)

    # organization user related
    org_name = models.CharField(max_length=100,
                                default="The Chinese University of Hong Kong",
                                null=False, blank=False)
    org_url = models.URLField(max_length=200, null=True, blank=True)
    org_intro = models.TextField(max_length=1000, null=True, blank=True)
    org_email = models.EmailField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.user.username



