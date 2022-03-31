from django import forms
from .models import Teamformation, Teammates
from django.core.exceptions import ValidationError

class Teamformation(forms.ModelForm):
    class Meta:
        model = Teamformation

    def clean(self):
        teammates = self.cleaned_data.get('teammates')
        teammsize = self.cleaned_data.get('teammsize')
        if teammates and teammates.count() > teammsize :
            raise ValidationError('Oops! NO Vacancy is left.')
        return self.cleaned_data
