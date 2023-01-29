from django.contrib.auth import authenticate, login
from django.views.generic import TemplateView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import WinnersSerializers
from rest_framework.views import APIView
from typing import Any, Dict, Optional
from django.http import JsonResponse
from django.shortcuts import render
from random import choice, randint
from rest_framework import status
from . import models
import json


class index(TemplateView):
    template_name = "index.html"
    SPIN_COST = 100

    def get_context_data(self, request, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context["winners"] = models.Winners.last_20_winners()
        if request.user.is_authenticated:
            context["balance"] = models.UserProfile.objects.get(user=request.user).get_user_info()[1]
        return context

    def get(self, request):
        return render(request, context=self.get_context_data(request), template_name=self.template_name)


    def post(self, request, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        balance_manager = models.UserProfile.objects.get(user=request.user)
        user = models.UserProfile.objects.get(user=request.user).get_user_info()[0]
        user_balance = models.UserProfile.objects.get(user=request.user).get_user_info()[1]
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
        if user_balance > self.SPIN_COST:
            balance_manager.spend_balance(self.SPIN_COST)
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
            return f"Have not enougth money. On your balance {user_balance}, spin's cost {self.SPIN_COST}"

class UserBalanceAPI(APIView):


    def get(self, request):
        if request.user.is_authenticated:
            user = models.UserProfile.objects.get(user=request.user)
            user_balance = user.get_user_balance()
            return Response({"username": user.get_username(), "user_balance": user_balance}, 200)
        else: 
            return Response({"error": "user is not logging in."}, 401)


class Spinner(APIView):


    SPIN_COST = 10
    PRIZES = [1, 2, 3, 4, 5, 6, 7, "JP"]
    JACKPOT = 1000


    @classmethod
    def get(cls, request):
        if request.user.is_authenticated:
            return Response(cls.PRIZES, 200)
        else:
            return Response({"error": "user is not logging in."}, 401)
        

    def post(self, request):
        if request.user.is_authenticated:
            balance_manager = models.UserProfile.objects.get(user=request.user)
            user = models.UserProfile.objects.get(user=request.user)
            user_balance = user.get_user_balance()
            username = user.get_username()
            result = self.make_spin(user_balance, balance_manager, user)
            if result != "JP":   
                if result >= 0: # прокрут произошёл
                    response = self.PRIZES[result]
                else: 
                    response = result # недостаточно баланса / выигрышь ноль
            if result == "JP":
                response = self.JACKPOT
            user_balance = user.get_user_balance()
            return Response({"result": result, "response": response, "username": username, "user_balance": user_balance}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "user is not logging in."}, 401)


    def spin_wheel(self):
        prizes = self.PRIZES
        return randint(0, len(prizes)-1)


    def make_spin(self, user_balance, balance_manager, user):
        if user_balance > self.SPIN_COST:
            balance_manager.spend_balance(self.SPIN_COST)
            number = self.spin_wheel()
            prize_won = self.PRIZES[number]
            if prize_won != "JP":
                if prize_won > 0:
                    amount = prize_won
                    balance_manager.add_balance(amount)
                    winner = models.Winners.objects.create(winner=user, winning_amount=amount)
                    winner.save()
                    return number
                else:
                    return -1
            elif prize_won == "JP":
                amount = self.JACKPOT
                balance_manager.add_balance(amount)
                winner = models.Winners.objects.create(winner=user, winning_amount=amount)
                winner.save()
                return "JP"
        else:
            return -2


class LastWinners(APIView):
    
    def get(self, request):
        if request.user.is_authenticated:
            winners = models.Winners.last_20_winners()
            winners_serializer = WinnersSerializers(winners, many=True)
            [print(i) for i in winners_serializer.data]
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
        if password1 == password2 and len(password1) < 8:
            messages.append("Password length must be at least 8 characters.")
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

        
