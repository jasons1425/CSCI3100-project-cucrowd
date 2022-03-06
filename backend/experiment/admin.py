from django.contrib import admin
from .models import Experiment


# Register your models here.
class ExperimentAdmin(admin.ModelAdmin):
    list_display = ("id", "host", "title")
    search_fields = ("id", "host__username", "title")

    def save_model(self, request, obj, form, change):
        if getattr(obj, 'host', None) is None:
            obj.host = request.user
        obj.save()


admin.site.register(Experiment, ExperimentAdmin)
