import experiment.views as views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'experiment', views.ExperimentView, basename='experiment')
urlpatterns = router.urls
