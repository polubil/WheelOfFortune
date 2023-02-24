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
from django.apps import apps


class VKLogin(APIView):


    try:
        response_type = "code"                   # Code/access_token. Code, in our case
        client_id     = settings.CLIENT_ID       # ID Приложения ВК
        redirect_uri  = settings.REDIRECT_URI    # адрес, на который будет передан code
        scope         = settings.SCOPE           # Запрашиваемые данные для доступа
        client_secret = settings.CLIENT_SECRET   # Secret key приложения ВК. 
    except AttributeError:
        raise AttributeError("You need to set 'CLIENT_ID', 'REDIRECT_URI', 'SCOPE' and 'CLIENT_SECRET' in your settings.py")
    

    def authorize(self, request, user_id, VKToken, expires_in, VK_user):
        '''
        models.SocialNetwork - model with social networks, which being connected. At this moment available only VK.com. 
        You must to run models.SocialNetwork.create(title="VK"). This is important because it's needed for identificate VK users.

        'code' in responses:
        1 - authenticated;
        0 - not authenticated.
        '''

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
                '''
                Creating user in django user model. 
                '''
                user = User.objects.create(
                    id = f'{user_id}',
                    username = user_id,
                    first_name = VK_user.get("first_name"),
                    last_name = VK_user.get("last_name"),
                )
                user.save()
                '''
                Pairing user with social network.
                This is important because it's needed for identificate VK users.
                '''
                account = models.SocialAccount.objects.create(
                    network = network,
                    user = user,
                )
                account.save()
                '''
                if you need take profile avatar for your goals set TAKE_PROFILE_PICTURE to True in settings.
                this will be set to ImageField (or another field type) called 'picture' of YOUR CUSTOM model extending  user model.
                You also need to set "APP_LABEL" and PROFILE_MODEL in settings.
                "APP_LABEL" - your app name, PROFILE_MODEL - your custom user model with field named 'picture'

                * function in development
                '''
                if settings.TAKE_PROFILE_PICTURE:
                    model = apps.get_model(app_label=settings.APP_LABEL, model_name=settings.PROFILE_MODEL)
                    model = model.objects.filter(user=user)
                    model.update(picture=VK_user.get("photo_max"))
                    print(model, VK_user.get("photo_max"))
                user = CustomBackend.authenticate(request, username=user_id)
                login(request, user, backend='VKAuth.backends.CustomBackend')
                return {"code": 1, "status": "signed up", "user": request.user.username}
        else:
            return {"code": 1, "status": "already signed in", "username": request.user.username}

    def get(self, request, *args, **kwargs):
        '''
        you neen to take code manually or in your frontend app. 
        for do this you need to redirect user to https://oauth.vk.com/authorize?
                                                 client_id=${params.client_id}&
                                                 redirect_uri=${params.redirect_uri}&
                                                 scope=${params.scope}&
                                                 response_type=${params.response_type}
        Params:
            client_id: your VK app ID, like 37983497
            redirect_uri: your redirect link, like http://localhost:8000/
            scope:"email, first_name, last_name",
            response_type:"code",

        When you got code with GET parametrs in 'redirect_link', 
        we will make get request to https://oauth.vk.com/access_token with some params. 
        You can see it below.

        Next, with access_token (we save it to database in table "VKToken" and pair it with user (see models.py)) 
        we making last get request and receiving reponse with user data: id, first_name, last_name, photo_max.
        Passing it to def 'authenticate' which you can see its logic above
        '''
            
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
    