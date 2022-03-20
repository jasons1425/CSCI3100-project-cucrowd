import uuid
from django.db import models
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from user_auth.models import OrgUserProfile
from django.db import models
from django.core.exceptions import ValidationError
from datetime import date
import datetime
import os


def get_exp_fp(instance, filename):
    return os.path.join("exp", f"{instance.id}_") + filename


def validate_deadline(value):
    if value < date.today():
        raise ValidationError("The date cannot be in the past!")
    return value


def validate_min(value):
    if value <= 0:
        raise ValidationError(
            '%(value)s is not an validate number',
            params={'value': value}
        )


class Experiment(models.Model):
    host = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             null=False, blank=True, editable=False)
    id = models.UUIDField(primary_key=True,
                          default=uuid.uuid4,
                          editable=False)
    title = models.CharField(max_length=100, default="Title",
                             null=False, blank=False)
    description = models.TextField(max_length=1000,
                                   default="Please type a short description.(around 200 words)")
    subtitle = models.CharField(max_length=100, default="Subtitle",
                                null=False, blank=False)
    target = models.CharField(max_length=100, default="University Students",
                            null=False, blank=False)
    job_nature = models.CharField(max_length=100,
        choices=[                                             
                ("Architecture_Surveying", "Architecture / Surveying"),
                ("Accounting_Auditing_Taxation", "Accounting / Auditing / Taxation"),
                ("Administration_Management", "Administration / Management"),
                ("Advertising_Public Relations", "Advertising / Public Relations"),
                ("Art_Design", "Art / Design"),
                ("Banking_Finance", "Banking / Finance"),           
                ("Business_Consultant", "Business Consultant"),            
                ("Civil_Engineering", "Civil Engineering"),                                        
                ("Clerical_Assistant_Office Routine", "Clerical / Assistant / Office Routine"),
                ("Community_Service", "Community Service"),
                ("Computer_Engineering_Informatio_Technology_eBusiness", "Computer Engineering / Information Technology / eBusiness"),
                ("Customer_Service", "Customer Service"),
                ("Disciplined_Services", "Disciplined Services"),
                ("Electrical_Electronic_Engineering", "Electrical / Electronic Engineering"),
                ("Environmental_Protection", "Environmental Protection"),
                ("Healthcare", "Healthcare"),
                ("Human_Resources_Training", "Human Resources / Training"),
                ("Industrial_Engineering", "Industrial Engineering"),            
                ("Insurance", "Insurance"),            
                ("Legal_Services", "Legal Services"),            
                ("Logistics_Transportation", "Logistics / Transportation"),            
                ("Mechanical_Engineering", "Mechanical Engineering"),           
                ("Media_Communication_Authors_Journalist", "Media / Communication / Authors / Journalist"),
                ("Other_Professional_Services", "Other Professional Services"),                                        
                ("Pharmacy", "Pharmacy"),
                ("Programming_System Analysis", "Programming / System Analysis"),
                ("Property_Real Estate Management", "Property / Real Estate Management"),
                ("Publication", "Publication"),
                ("Purchasing_Merchandizing", "Purchasing / Merchandizing"),
                ("Office_Routine", "Office Routine"),
                ("Religious_Work", "Religious Work"),
                ("Retail_Management", "Retail Management"),
                ("Sales_Marketing", "Sales & Marketing"),
                ("Scientific_Research_Work", "Scientific & Research Work"),
                ("Secretarial_Executive_Assistant_Personal Assistant", "Secretarial / Executive Assistant / Personal Assistant"),
                ("Social_Work", "Social Work"),
                ("Statistics", "Statistics"),
                ("Teaching_Others", "Teaching: Others"),
                ("Teaching_Primary", "Teaching: Primary"),
                ("Teaching_Private_Tuition", "Teaching: Private Tuition"),
                ("Teaching_Secondary", "Teaching: Secondary"),
                ("Technical_Support", "Technical Support"),
                ("Telecommunication_Engineering", "Telecommunication Engineering"),
                ("Translation", "Translation"),
                ("others", "others"),
        ],
        default="Architecture_Surveying",
        null=False,
        blank=False
    )

    type = models.CharField(
        max_length=6,
        choices=[
            ('FT', "FullTime"),
            ('Intern', "internship"),
            ('PT', "PartTime"),
            ("NA", "others"),
        ],
        default="NA",
        null=False,
        blank=False
    )

    duration = models.CharField(max_length=200, default="July - Aug",
                                null=False, blank=False)
    salary = models.CharField(max_length=200, default="HKD$65/1hr",
                              null=False, blank=False)
    venue = models.CharField(max_length=200, null=False, blank=False)
    
    deadline = models.DateField(validators=[validate_deadline], default=date.today)
    post_date = models.DateField(auto_now_add=True)
    last_modified = models.DateField(auto_now=True)
    exp_img = models.ImageField(upload_to=get_exp_fp, null=True, blank=True)
    vacancy = models.IntegerField(validators=[validate_min])
    ############## still doing####################
    ### here for user to input timeslot
    #time_list =  
    #######################################

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    experiment = models.ForeignKey(Experiment,
                                   on_delete=models.CASCADE,
                                   null=False, blank=True)
    participant = models.ForeignKey(settings.AUTH_USER_MODEL,
                                    on_delete=models.CASCADE,
                                    null=False, blank=True)
    time = models.DateTimeField()

    def __str__(self):
        title = self.experiment.title
        username = self.participant.username
        return ' - '.join([title, username])
