from typing import Any, Dict, Optional
from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from backend import models
from random import choice, randint
from rest_framework.views import APIView
from .serializers import WinnersSerializers
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
import json, requests
from django.contrib.auth.models import User
import datetime as dt
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.decorators import login_required


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
        

class VKLogin(APIView):
    app_settings = models.Settings.objects
    client_id=app_settings.get(key="client_id").value           # ID Приложения ВК
    redirect_uri=app_settings.get(key="redirect_uri").value     #адрес, на который будет передан code
    scope=app_settings.get(key="scope").value                   # Запрашиваемые данные для доступа
    response_type="code"                                        # Code/access_token. Code, in our case
    client_secret=app_settings.get(key="client_secret").value   # Secret key приложения ВК. 
    def authorize(self, request, user_id, VKToken, expires_in, VK_user):
        network = models.SocialNetwork.objects.get(title="VK")
        user = CustomBackend.authenticate(request=request, 
                                            username=user_id,
                                            token=VKToken, 
                                            expires_in=expires_in)
        if not request.user.is_authenticated:
            if user is not None:
                login(request, user, backend='backend.views.CustomBackend')
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
                login(request, user, backend='backend.views.CustomBackend')
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
                    return Response(auth)
                else:
                    return Response({"code": 0, "details": access_token})
            else:
                return Response({"code": 0, "details": request.GET})
    

def responses(request):
    return JsonResponse(request.GET)

class index(TemplateView):
    template_name = "index.html"
    spin_cost = 100

    def get_context_data(self, request, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context["winners"] = models.Winners.last_20_winners()
        if request.user.is_authenticated:
            context["balance"] = models.UserBalance.objects.get(user=request.user).get_user_info()[1]
        return context

    def get(self, request):
        return render(request, context=self.get_context_data(request), template_name=self.template_name)


    def post(self, request, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        balance_manager = models.UserBalance.objects.get(user=request.user)
        user = models.UserBalance.objects.get(user=request.user).get_user_info()[0]
        user_balance = models.UserBalance.objects.get(user=request.user).get_user_info()[1]
        action = request.POST.get("action")
        if action == "make_spin":
            result = self.make_spin(user_balance, balance_manager, user)
            context["message"] = result
        print(request.POST)
        return render(request, context=self.get_context_data(request) | context, template_name=self.template_name)

    def spin_wheel(self):
        jackpot = 10000
        prizes = [100, 400, 200, 0, 1000, 0, 0]
        return choice(prizes)

    def make_spin(self, user_balance, balance_manager, user):
        if user_balance > self.spin_cost:
            balance_manager.spend_balance(self.spin_cost)
            print("spin", user, user_balance)
            prize = self.spin_wheel()
            if prize > 0:
                balance_manager.add_balance(prize)
                winner = models.Winners.objects.create(winner=user, winning_amount=prize)
                winner.save()
                return f"You won {prize}"
            else:
                return f"Oh, you won nothing, try again"
        else:
            return f"Have not enougth money. On your balance {user_balance}, spin's cost {self.spin_cost}"

class UserBalanceAPI(APIView):

    def get(self, request, format=None):
        if request.user.is_authenticated:
            user_balance = models.UserBalance.objects.get(user=request.user).get_user_info()[1]
            user = models.UserBalance.objects.get(user=request.user).get_user_info()[0]
            winners = models.Winners.last_20_winners()
            winners_serializer = WinnersSerializers(winners, many=True)
            return Response({"username": user.username, "user_balance": user_balance}, 200)
        else: 
            return Response({"error": "user is not logging in."}, 401)


class Spinner(APIView):

    spin_cost = 100

    def post(self, request):
        if request.user.is_authenticated:
            balance_manager = models.UserBalance.objects.get(user=request.user)
            user = models.UserBalance.objects.get(user=request.user).get_user_info()[0]
            user_balance = models.UserBalance.objects.get(user=request.user).get_user_info()[1]
            prize_index = self.make_spin(user_balance, balance_manager, user)
            if prize_index != -1:
                result = Prizes.get_prizes()[prize_index]
            else: result = -1
            user_balance = models.UserBalance.objects.get(user=request.user).get_user_info()[1]
            return Response({"prize_index": prize_index, "result": result, "username": user.username, "user_balance": user_balance}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "user is not logging in."}, 401)


    def spin_wheel(self):
        jackpot = 1000
        prizes = Prizes.get_prizes()
        return randint(0, len(prizes)-1)


    def make_spin(self, user_balance, balance_manager, user):
        if user_balance > self.spin_cost:
            balance_manager.spend_balance(self.spin_cost)
            prize = self.spin_wheel()
            if prize > 0:
                amount = Prizes.get_prizes()[prize]
                balance_manager.add_balance(amount)
                winner = models.Winners.objects.create(winner=user, winning_amount=amount)
                winner.save()
                return prize
            else:
                return 0
        else:
            return -1

class Prizes(APIView):

    PRIZES = [1000, 200, 400, 750, 250, 10, 150, 1000]

    @classmethod
    def get(cls, request):
        if request.user.is_authenticated:
            return Response(cls.PRIZES, 200)
        else:
            return Response({"error": "user is not logging in."}, 401)

    @classmethod
    def get_prizes(cls):
        return cls.PRIZES


class LastWinners(APIView):
    
    def get(self, request):
        if request.user.is_authenticated:
            winners = models.Winners.last_20_winners()
            winners_serializer = WinnersSerializers(winners, many=True)
            return Response(winners_serializer.data)
        else:
            return Response({"error": "user is not logging in."}, 401)

class LoginChecker(APIView):

    def get(self, request):
        return Response(request.user.is_authenticated)


class Login(APIView):

    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        password = data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"message": "Success!"})
        else:
            return Response({"message": "Authenfication failed."})

class Register(APIView):

    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        password1 = data.get("password1")
        password2 = data.get("password2")
        messages = []
        if password2 != password1:
            messages.append("Passwords do not match.")
        if not (3 < len(username) < 20):
            messages.append("Username length must be at least 4 and no more than 20 characters.")
        if password1 == password2 and len(password1) < 4:
            messages.append("Password length must be at least 4 characters.")
        if len(messages) == 0:
            user = User.objects.create_user(
                username = username, 
                password = password1,
                first_name = first_name,
                last_name = last_name,
                )
            user.save()
            user = authenticate(request, username=username, password=password1)
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        print(messages, username, password1, password2)
        return Response({"messages": messages})

        
