from django.urls import path, include
from rest_framework import routers
import user_auth.views as views

router = routers.DefaultRouter()
router.register(r'profile', views.ProfileView, basename="profile")


urlpatterns = [
    path('login', views.LogInView.as_view(), name='login'),
    path('logout', views.LogOutView.as_view(), name='logout'),
    path('signup', views.SignUpView.as_view(), name='signup'),
    # the following line automaitcally import 3 reset password email endpoints:
    #   POST ${API_URL}/ - request a reset password token by using the email parameter
    #   POST ${API_URL}/confirm/ - using a valid token, the users password is set to the provided password
    #   POST ${API_URL}/validate_token/ - will return a 200 if a given token is valid
    # refer to issue #13 for details
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset'))
] + router.urls
