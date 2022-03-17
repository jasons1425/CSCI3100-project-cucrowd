import uuid

from attr import field
from user_auth.models import OrgUserProfile
from django.db import models
from django.core.exceptions import ValidationError
from datetime import date
import datetime
import os

def get_exp_fp(instance, filename):
    return os.path.join("exp/", f"{instance.username}_") + filename

#dateobject 
def validate_deadline(self):
    date = self.deadline['deadline']
    if date < datetime.date.today():  
        raise ValidationError("The date cannot be in the past!")
    return date

def validate_min(value):
    if value <= 0 :
        raise ValidationError(('%(value)s is not an validate number'),
            params={'value': value},
        )



class Experiment_field(models.Model):
    host_id=models.ForeignKey(OrgUserProfile.org_id,null=False,blank=False,editable=False)
    post_id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title=models.CharField(max_length=100,default="Title",null=False, blank=False)
    subtitle=models.CharField(max_length=100,default="Subtitle",null=False, blank=False)
    employer=models.ForeignKey(OrgUserProfile.org_name,null=False, blank=False,editable=False)
    target=models.CharField(max_length=100,default="University Students",null=False, blank=False)
    Job_Nature=models.CharField(max_length=100,
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

    type= models.CharField(
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

    duration=models.CharField(max_length=200,default="July - Aug",null=False, blank=False)
    salary=models.CharField(max_length=200,default="HKD$65/1hr",null=False, blank=False)
    venue=models.CharField(max_length=200,null=False, blank=False)
    highlight=models.CharField(max_length=500,default="Please type a short description.(around 200 words)",null=False, blank=False)
    deadline=models.DateField(("Deadline"),validators=[validate_deadline],default=date.today)
    post_date=models.DateField(("Post_date"),auto_now_add=True)
    last_modified=models.DateField(("last_modified"),auto_now=True)
    exp_img = models.ImageField(upload_to=get_exp_fp, null=True, blank=True)
    ############## still doing####################
    ### here for user to input timeslot
    #time_list =  
    #######################################
    vacancy = models.IntegerField(validators=[validate_min])
    def __str__(self):
        return self.title
