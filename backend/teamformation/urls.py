import teamformation.views as views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'teamformation', views.TeamformationView, basename='teamformation')
router.register(r'teammates', views.TeammatesView, basename="teammates")
urlpatterns = router.urls
