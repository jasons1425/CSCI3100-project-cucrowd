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
    if value <= 0:
        raise FieldValidationError(
            '%(value)s is not an validate number, it is too small.',
            params={'value': value}
        )
    if value > 10:
        raise FieldValidationError(
            '%(value)s is not an validate number, it is too large.',
            params={'value': value}
        )
    
# Create your models here.
class Questionnaire(models.Model):
    id = models.UUIDField(primary_key=True,
                            default=uuid.uuid4,editable=False)
    title = models.CharField(max_length=100,default = "Please type the title here.",  help_text="Please enter the title",
                            null=False, blank=False)
    host = models.ForeignKey(settings.AUTH_USER_MODEL,
                            on_delete=models.CASCADE,
                            null=False, blank=True, editable=False)
    description = models.TextField(max_length=200,default = "Please type the description here.", 
                            help_text="Please type a short description.(around 200 words)",null=False, blank=False)
    deadline = models.DateField(validators=[validate_deadline], default=date.today)
    post_date = models.DateField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)
    questionsize = models.IntegerField(validators=[validate_size], default = "Please enter the number of questions here.",
                            help_text="Please enter an integer number. (Minimum is 1 and Maximum is 10)",null=False, blank=False)
    questiontype = models.CharField(
        max_length=6,
        choices=[
            ('mc', "Multiple Choice"),
            ('lq', "Long Question"),
            ('sc', "Scoring"),
            ("gf", "Google Form"),
        ],
        default="mc",
        null=False,
        blank=False
    )
    question = models.TextField(max_length=5000,default = "Please type the question here.", 
                                                help_text="Type each question delimited by `;`, "
                                                "e.g. How old are you?; Where do you live?",null=False, blank=False)
    publishable = models.BooleanField(default=True, null=False, blank=False)
    exp_finish= models.CharField(max_length=100,default = "Please type the expected finishing time here.",  help_text="Please enter the the expected finishing time",
                            null=False, blank=False)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

class Answer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    questionnaire = models.ForeignKey(Questionnaire, default="",
                                      on_delete=models.CASCADE,
                                      null=False, blank=False)    
    respondent = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,
                                null=False, blank=False)
    Ans = models.TextField(max_length=3000,default = "Please type the answer here.", 
                                                help_text="Type each answer delimited by `;`, "
                                                "e.g. 6 years old; Hong Kong",null=False, blank=False)
    def __str__(self):
        title = self.questionnaire.title
        username = self.respondent.username
        return ' - '.join([title, username])

    def clean(self, *args, **kwargs):
        if getattr(self, "questionnaire", None) is None or getattr(self, "respondent", None) is None:
            raise FieldValidationError("Answer must have both questionnaire and respondent.")
        questionsize = self.questionnaire.questionsize
        answer = self.Ans.split(';')
        try:
                assert len(answer) == questionsize
        except AssertionError:
            raise FieldValidationError(" Answers do not match the questionsize.")
        super().clean(*args, **kwargs)        

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)  
