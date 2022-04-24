import teamformation.views as views
from rest_framework.routers import SimpleRouter


# make the trailing slash optional on the simple router
# ref: https://www.twblogs.net/a/5db2dfc2bd9eee310ee64dbf
# https://stackoverflow.com/questions/46163838
class StandardRouter(SimpleRouter):
    def __init__(self, trailing_slash="/?"):
        super().__init__()
        self.trailing_slash = trailing_slash


router = StandardRouter()
router.register(r'teamformation', views.TeamView, basename='team')
# router.register(r'teammates', views.TeammatesView, basename="teammates")
urlpatterns = router.urls
