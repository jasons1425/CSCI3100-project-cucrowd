from django.urls import path, include
from rest_framework import routers
import user_auth.views as views

# incorrect as routers are used with viewset only
# router = routers.DefaultRouter()
# router.register(r'example', views.ExampleView.as_view(), 'example')

urlpatterns = [
    path('login', views.LogInView.as_view(), name='login'),
    path('logout', views.LogOutView.as_view(), name='logout'),
    path('signup', views.SignUpView.as_view(), name='signup')
]
