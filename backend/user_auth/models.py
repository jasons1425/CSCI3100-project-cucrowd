from django.db import models
from rest_framework.authentication import TokenAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from datetime import datetime, timedelta
import pytz


# Create your models here.
class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        model = self.get_model()
        try:
            token = model.objects.get(key=key)
        except model.DoesNotExist:
            raise AuthenticationFailed("Invalid token")

        if not token.user.is_active:
            raise AuthenticationFailed("Inactive user")

        utc_now = datetime.utcnow().replace(tzinfo=pytz.utc)
        if token.created < utc_now - timedelta(hours=72):  # token expire after 3 days
            raise AuthenticationFailed("Token has expired")

        return token.user, token
