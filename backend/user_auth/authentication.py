from rest_framework.authentication import TokenAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from datetime import datetime, timedelta
import pytz


# this class is responsible for authenticating user with the auth-token
#   thus, user can maintain their login state with the token
class ExpiringTokenAuthentication(TokenAuthentication):
    # get authorization key by cookies
    def authenticate(self, request):
        auth = request.COOKIES.get("Authorization", None)
        if auth is None:
            auth = request.COOKIES.get("authorization", None)
        if auth is None:
            return super().authenticate(request)
        auth = auth.encode("utf-8").split()
        token = auth[1].decode()

        return self.authenticate_credentials(token)

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
            token.delete()
            raise AuthenticationFailed("Token has expired")
        return token.user, token
