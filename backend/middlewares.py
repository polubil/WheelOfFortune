from . import models
from django.contrib.auth import logout
import datetime as dt
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from rest_framework.renderers import BrowsableAPIRenderer

class CheckTokenMW:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        network = models.SocialNetwork.objects.get(title="VK")
        user = request.user
        if user.is_authenticated:
            if models.SocialAccount.objects.filter(user=user, network=network).exists():
                token = models.VKToken.objects.filter(id=user.username)
                if token.exists():
                    expires = models.VKToken.objects.get(id=user.username).expires
                    if expires < dt.datetime.now(expires.tzinfo):
                        logout(request)
        return response
        