from django.contrib import admin
from django.core.exceptions import ValidationError as FieldValidationError
from .models import Questionnaire, Answer


# Register your models here.
class AnswerInline(admin.TabularInline):
    model = Answer

class QuestionnaireAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "host", "questionsize", "post_date", "publishable")
    inlines = [AnswerInline]

    def save_model(self, request, obj, form, change):
        if getattr(obj, 'host', None) is None:
            obj.host = request.user
        obj.save()


class AnswerAdmin(admin.ModelAdmin):
    list_display = ("id", "questionnaire", "Respondent")

admin.site.register(Questionnaire, QuestionnaireAdmin)
admin.site.register(Answer, AnswerAdmin)
