import uuid
from datatime import date
from django.db import models

# Create your models here.

class Student_user(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    MEN = 'M'
    FEMALE = 'F'
    NA = 'NA'
    gender_choices = [
        (MEN,'M'),
        (FEMALE,'F'),
        (NA,'NA'),
    ]
    gender = models.CharField(
        max_length = 1,
        choices = gender_choices,
        default = NA,
    )
    date_of_birth = models.DateField()
    major = models.CharField(max_length=50)
    admission_year=models.DateField()
    email = models.EmailField()
    profile_img= models.ImageField(upload_to = "image/")
    create_time=models.DateTimeField(auto_now_add= True)

    def __str__(self):
        return self.name

class organization_user(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    organiztion_name = models.CharField(max_length=50)
    email = models.EmailField()
    profile_img= models.ImageField(upload_to = "image/")
    create_time=models.DateTimeField(auto_now_add= True)


    def __str__(self):
        return self.name
