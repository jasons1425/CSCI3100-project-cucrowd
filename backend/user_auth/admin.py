from django.contrib import admin
from user_auth.models import StudentProfile, OrgUserProfile, CrowdUser


# Register your models here.
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "major", "admission_year")
    search_fields = ("user__username",)


class OrgUserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "org_name")
    search_fields = ("user__username", "org_name")


class CrowdUserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "is_org")
    search_fields = ("username", "email")


admin.site.register(StudentProfile, StudentProfileAdmin)
admin.site.register(OrgUserProfile, OrgUserProfileAdmin)
admin.site.register(CrowdUser, CrowdUserAdmin)
