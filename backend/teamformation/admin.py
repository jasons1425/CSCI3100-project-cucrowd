from django.contrib import admin
from .models import Teammates, Teamformation

# Register your models here.
class TeammatesAdmin(admin.ModelAdmin):
    list_display = ("info",)


class TeamformationAdmin(admin.ModelAdmin):
    list_display = ("id",)
    
    def save_model(self, request, obj, form, change):
        if getattr(obj, 'host', None) is None:
            obj.host = request.user
        obj.save()


admin.site.register(Teammates, TeammatesAdmin)
admin.site.register(Teamformation, TeamformationAdmin)
