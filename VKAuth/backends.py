from . import models
from django.contrib.auth.models import User
import datetime as dt
from django.contrib.auth.backends import BaseBackend
from typing import Any



class CustomBackend(BaseBackend):

    def authenticate(request, username=None, token=None, expires_in=None, **kwargs: Any):
        if models.VKToken.objects.filter(id=username).exists():
            expires = models.VKToken.objects.get(id=username).expires
            if expires < dt.datetime.now(expires.tzinfo):
                VKToken = models.VKToken.objects.get(id=username)
                VKToken.token = token
                VKToken.expires = dt.datetime.now()+dt.timedelta(seconds=expires_in)
                VKToken.save()
        else:
            VKToken = models.VKToken.objects.create(
                id = username,
                token = token,
                expires = dt.datetime.now()+dt.timedelta(seconds=expires_in),
            )
            VKToken.save()
        user = models.User.objects.filter(username=username)
        if user.exists():
            return user[0]
        else:
            return None

    def get_user(self, user_id):
        if User.objects.filter(id=user_id).exists():
            user = User.objects.get(id=user_id)
            if user:
                return user
            else: 
                return None
        else: 
            return None
        