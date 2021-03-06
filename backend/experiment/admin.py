from django.contrib import admin
from django.core.exceptions import ValidationError as FieldValidationError
from .models import Experiment, Enrollment


# Allow showing the child object (enrollment) of experiment instances when editing on the admin site
class EnrollmentInline(admin.TabularInline):
    model = Enrollment


# Experiment instance view on the admin site
class ExperimentAdmin(admin.ModelAdmin):
    list_display = ("id", "host", "title", "post_date")
    search_fields = ("id", "host__username", "title")
    ordering = ['-post_date', 'id']
    inlines = [EnrollmentInline]

    def save_model(self, request, obj, form, change):
        if getattr(obj, 'host', None) is None:
            obj.host = request.user
        obj.save()


# Enrollment instance view on the admin site
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("id", "experiment", "participant")
    search_fields = ("experiment__title", "participant__username")


admin.site.register(Experiment, ExperimentAdmin)
admin.site.register(Enrollment, EnrollmentAdmin)
