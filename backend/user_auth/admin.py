from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm
from user_auth.models import StudentProfile, OrgUserProfile, CrowdUser


# Register your models here.
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "major", "admission_year")
    search_fields = ("user__username",)


class OrgUserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "org_name")
    search_fields = ("user__username", "org_name")


class UserCreateForm(UserCreationForm):
    class Meta:
        model = CrowdUser
        fields = ('email', 'username')


# ref:
# https://stackoverflow.com/a/17496836/16418649
class CrowdUserAdmin(UserAdmin):
    list_display = ("id", "username", "email", "is_org")
    search_fields = ("username", "email")
    fieldsets = UserAdmin.fieldsets + (
        ("Is organizational user?", {'fields': ('is_org', )}),
    )
    add_form = UserCreateForm
    add_fieldsets = (
        (None, {
            'classes': ('wide', ),
            'fields': ('email', 'username', 'password1', 'password2',),
        }),
    )


admin.site.register(StudentProfile, StudentProfileAdmin)
admin.site.register(OrgUserProfile, OrgUserProfileAdmin)
admin.site.register(CrowdUser, CrowdUserAdmin)
