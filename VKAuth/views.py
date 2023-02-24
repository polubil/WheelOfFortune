from typing import Any
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
import json, requests
from django.contrib.auth.models import User
from VKAuth import models
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from .backends import CustomBackend



class VKLogin(APIView):
    try:
        client_id     = settings.CLIENT_ID       # ID Приложения ВК
        redirect_uri  = settings.REDIRECT_URI    # адрес, на который будет передан code
        scope         = settings.SCOPE           # Запрашиваемые данные для доступа
        response_type = "code"                                        # Code/access_token. Code, in our case
        client_secret = settings.CLIENT_SECRET   # Secret key приложения ВК. 
    except AttributeError:
        raise ValueError("You need to set client ID, redirect_uri, scope and client secret in your settings.py")
    def authorize(self, request, user_id, VKToken, expires_in, VK_user):
        network = models.SocialNetwork.objects.get(title="VK")
        user = CustomBackend.authenticate(request=request, 
                                            username=user_id,
                                            token=VKToken, 
                                            expires_in=expires_in)
        if not request.user.is_authenticated:
            if user is not None:
                login(request, user, backend='VKAuth.backends.CustomBackend')
                return {"code": 1, "status": "signed in", "user": request.user.username}
            else:
                user = User.objects.create(
                    id = user_id,
                    username = user_id,
                    first_name = VK_user.get("first_name"),
                    last_name = VK_user.get("last_name"),
                )
                user.save()
                account = models.SocialAccount.objects.create(
                    network = network,
                    user = user,
                )
                account.save()
                user = CustomBackend.authenticate(request, username=user_id)
                login(request, user, backend='VKAuth.backends.CustomBackend')
                return {"code": 1, "status": "signed up", "user": request.user.username}
        else:
            return {"code": 1, "status": "already signed in", "username": request.user.username}

    def get(self, request, *args, **kwargs):
            if request.GET.get("code"):
                self.code=request.GET.get("code")
                req_info = {
                    "client_id": self.client_id,
                    "redirect_uri":self.redirect_uri,
                    "code": self.code,
                    "client_secret": self.client_secret,
                }
                access_token = requests.get(f"https://oauth.vk.com/access_token", params=req_info).json()
                if access_token.get("access_token"):
                    token = access_token["access_token"]
                    expires_in = access_token["expires_in"]
                    user_id = access_token["user_id"]
                    params = {
                        "access_token": token,
                        "user_ids": user_id,
                        "fields": "first_name, last_name, photo_max",
                        "v": "5.131",
                    }
                    VK_user = requests.post("https://api.vk.com/method/users.get", params=params).json()["response"][0]

                    print(VK_user)
                    auth = self.authorize(request, user_id, token, expires_in, VK_user)
                    print(auth)
                    return Response(auth)
                else:
                    return Response({"code": 0, "details": access_token})
            else:
                return Response({"code": 0, "details": request.GET})
    