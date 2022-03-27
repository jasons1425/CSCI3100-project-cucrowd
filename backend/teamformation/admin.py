from django.contrib import admin
from .models import Teammates, Teamformation

# Register your models here.
class TeammatesAdmin(admin.ModelAdmin):
    list_display = ("info")
    search_fields = ("info")




class TeamformationAdmin(admin.ModelAdmin):
    list_display = ("id",)
    search_fields = ()




admin.site.register(Teammates, TeammatesAdmin)
admin.site.register(Teamformation, TeamformationAdmin)
