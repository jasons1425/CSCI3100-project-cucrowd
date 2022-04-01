import teamformation.views as views
from rest_framework.routers import SimpleRouter


class StandardRouter(SimpleRouter):
    def __init__(self, trailing_slash="/?"):
        super().__init__()
        self.trailing_slash = trailing_slash


router = StandardRouter()
router.register(r'teamformation', views.TeamView, basename='team')
# router.register(r'teammates', views.TeammatesView, basename="teammates")
urlpatterns = router.urls
