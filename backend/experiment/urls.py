import experiment.views as views
from rest_framework.routers import SimpleRouter


# ref: https://www.twblogs.net/a/5db2dfc2bd9eee310ee64dbf
class StandardRouter(SimpleRouter):
    def __init__(self, trailing_slash="/?"):
        super().__init__()
        self.trailing_slash = trailing_slash


router = StandardRouter()
router.register(r'experiment', views.ExperimentView, basename='experiment')
router.register(r'enroll', views.EnrollView, basename="enroll")
urlpatterns = router.urls
