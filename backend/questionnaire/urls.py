import questionnaire.views as views
from rest_framework.routers import SimpleRouter


# ref: https://www.twblogs.net/a/5db2dfc2bd9eee310ee64dbf
class StandardRouter(SimpleRouter):
    def __init__(self, trailing_slash="/?"):
        super().__init__()
        self.trailing_slash = trailing_slash


router = StandardRouter()
router.register(r'questionnaire', views.QuestionnaireView, basename='questionnaire')
router.register(r'answer', views.AnswerView, basename="answer")
urlpatterns = router.urls
