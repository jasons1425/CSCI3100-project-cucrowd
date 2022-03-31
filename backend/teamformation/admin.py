from django.contrib import admin
from django.core.exceptions import ValidationError as FieldValidationError
from .models import Teammates, Teamformation

# Register your models here.

class TeamformationAdmin(admin.ModelAdmin):
    list_display = ("id","title","host","teamsize","post_date",)


    def save_model(self, request, obj, form, change):
        if getattr(obj, 'host', None) is None:
            obj.host = request.user
        obj.save()

class TeammatesAdmin(admin.ModelAdmin):
    list_display = ("id","info","teamformation")


admin.site.register(Teamformation, TeamformationAdmin)
admin.site.register(Teammates, TeammatesAdmin)
