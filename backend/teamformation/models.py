import uuid
from django.db import models
from datetime import date
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from django.core.exceptions import ValidationError as FieldValidationError
from user_auth.models import StudentProfile


def validate_deadline(value):
    if value < date.today():
        raise FieldValidationError("The date cannot be in the past!")
    return value

def validate_size(value):
    if value <= 1:
        raise FieldValidationError(
            '%(value)s is not an validate number',
            params={'value': value}
        )
    if value > 5:
        raise FieldValidationError(
            '%(value)s is not an validate number',
            params={'value': value}
        )
    
class Teammates(models.Model):
    info = models.ForeignKey(StudentProfile,on_delete=models.CASCADE,
                                null=False, blank=False)

# Create your models here.
class Teamformation(models.Model):
    id = models.UUIDField(primary_key=True,
                            default=uuid.uuid4,editable=False)
    title = models.CharField(max_length=100, help_text="Please enter the title",
                            null=False, blank=False)
    host = models.ForeignKey(settings.AUTH_USER_MODEL,
                            on_delete=models.CASCADE,
                            null=False, blank=True, editable=False)
    self_intro = models.TextField(max_length = 100,    
                            help_text="Please type a short self-introduction.(around 100 words)",null=False, blank=False)
    description = models.TextField(max_length=200,
                            help_text="Please type a short description.(around 200 words)",null=False, blank=False)
    Requirements = models.TextField(max_length = 100, 
                            help_text="Please type your requirements that team members need.(around 100 words)",null=False, blank=False)
    link = models.TextField(max_length = 300 , 
                            help_text="Please enter the links that you need.(if available)",null=True, blank=True )
    contact = models.TextField(max_length = 100, 
                            help_text="Please type your contact. (Email , Phone number, etc...)",null=False, blank=False)
    deadline = models.DateField(validators=[validate_deadline], default=date.today)
    post_date = models.DateField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)
    teamsize = models.IntegerField(validators=[validate_size],
                            help_text="Please enter an integer number. (Minimum is 2 and Maximum is 5)",null=False, blank=False)
    teammates = models.ForeignKey(Teammates,
                            on_delete=models.CASCADE,
                            null=True, blank=True)
