from VKAuth import models
from django.contrib.auth import logout
import datetime as dt
from django.core.exceptions import ObjectDoesNotExist

class CheckTokenMW:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        try:
            network = models.SocialNetwork.objects.get(title="VK")
            user = request.user
            if user.is_authenticated:
                if models.SocialAccount.objects.filter(user=user, network=network).exists():
                    token = models.VKToken.objects.filter(id=user.username)
                    if token.exists():
                        expires = token[0].expires
                        if expires < dt.datetime.now(expires.tzinfo):
                            print('logout')
                            logout(request)
        except:
            raise ValueError("You must create SocialNetwork with 'title'='VK'")
        return response
        