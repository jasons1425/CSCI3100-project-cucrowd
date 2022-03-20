import experiment.views as views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'experiment', views.ExperimentView, basename='experiment')
router.register(r'enroll', views.EnrollView, basename="enroll")
urlpatterns = router.urls
