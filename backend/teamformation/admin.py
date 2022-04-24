from django.contrib import admin
from django.core.exceptions import ValidationError as FieldValidationError
from .models import Teammates, Teamformation


# Allow showing the child object (members) of team instances when editing on the admin site
class TeammatesInline(admin.TabularInline):
    model = Teammates


# Team instances view on the admin site
class TeamformationAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "host", "teamsize", "post_date", "publishable")
    inlines = [TeammatesInline]
    ordering = ['-post_date']  # sort by latest post_date by default

    # assign the requesting user as the team host upon saving
    #   this is to prevent admins / users from creating teams in others' names
    def save_model(self, request, obj, form, change):
        if getattr(obj, 'host', None) is None:
            obj.host = request.user
        obj.save()


# Teammate instances view on the admin site
class TeammatesAdmin(admin.ModelAdmin):
    list_display = ("id", "info", "teamformation", "state")


admin.site.register(Teamformation, TeamformationAdmin)
admin.site.register(Teammates, TeammatesAdmin)
