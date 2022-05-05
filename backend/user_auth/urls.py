from django.urls import path, include
from rest_framework.routers import SimpleRouter
import user_auth.views as views


# make the trailing slash optional on the simple router
# ref: https://www.twblogs.net/a/5db2dfc2bd9eee310ee64dbf
# https://stackoverflow.com/questions/46163838
class StandardRouter(SimpleRouter):
    def __init__(self, trailing_slash="/?"):
        super().__init__()
        self.trailing_slash = trailing_slash


router = StandardRouter()
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
