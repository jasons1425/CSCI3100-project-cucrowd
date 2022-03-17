from experiment.models import Experiment_field
from user_auth.models import OrgUserProfile
from django.db import models



class Enroll_field(models.Model):
    title=models.ForeignKey(Experiment_field.title,null=False, blank=False,editable=False)
    employer=models.ForeignKey(OrgUserProfile.org_name,null=False, blank=False,editable=False)
    highlight=models.ForeignKey(Experiment_field.highlight,null=False, blank=False,editable=False)
    target=models.ForeignKey(Experiment_field.target,null=False, blank=False,editable=False)
    #timeslot_LIST = models.ForeignKey(Experiment_field.time_list,null=False, blank=False,editable=False)
    #time_slot=models.IntegerField(choices=timeslot_LIST)
    vacancy = models.ForeignKey(Experiment_field.vacancy,null=False, blank=False,editable=False)
