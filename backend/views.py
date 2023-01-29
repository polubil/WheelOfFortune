from typing import Any, Dict
from django.shortcuts import render
from django.views.generic import TemplateView
from .models import Winners, UserBalance
from random import choice, randint
from rest_framework.views import APIView
from .serializers import WinnersSerializers
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
import json
from django.contrib.auth.models import User

class index(TemplateView):
    template_name = "index.html"
    spin_cost = 100

    def get_context_data(self, request, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context["winners"] = Winners.last_20_winners()
        context["balance"] = UserBalance.objects.get(user=request.user).get_user_info()[1]
        return context

    def get(self, request):
        return render(request, context=self.get_context_data(request), template_name=self.template_name)


    def post(self, request, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        balance_manager = UserBalance.objects.get(user=request.user)
        user = UserBalance.objects.get(user=request.user).get_user_info()[0]
        user_balance = UserBalance.objects.get(user=request.user).get_user_info()[1]
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
                winner = Winners.objects.create(winner=user, winning_amount=prize)
                winner.save()
                return f"You won {prize}"
            else:
                return f"Oh, you won nothing, try again"
        else:
            return f"Have not enougth money. On your balance {user_balance}, spin's cost {self.spin_cost}"

class UserBalanceAPI(APIView):

    def get(self, request, format=None):
        user_balance = UserBalance.objects.get(user=request.user).get_user_info()[1]
        user = UserBalance.objects.get(user=request.user).get_user_info()[0]
        winners = Winners.last_20_winners()
        winners_serializer = WinnersSerializers(winners, many=True)
        return Response({"username": user.username, "user_balance": user_balance})


class Spinner(APIView):

    spin_cost = 100

    def post(self, request):
        balance_manager = UserBalance.objects.get(user=request.user)
        user = UserBalance.objects.get(user=request.user).get_user_info()[0]
        user_balance = UserBalance.objects.get(user=request.user).get_user_info()[1]
        prize_index = self.make_spin(user_balance, balance_manager, user)
        if prize_index != -1:
            result = Prizes.get_prizes()[prize_index]
        else: result = -1
        user_balance = UserBalance.objects.get(user=request.user).get_user_info()[1]
        return Response({"prize_index": prize_index, "result": result, "username": user.username, "user_balance": user_balance}, status=status.HTTP_201_CREATED)


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
                winner = Winners.objects.create(winner=user, winning_amount=amount)
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
        return Response(cls.PRIZES, status=status.HTTP_201_CREATED)

    @classmethod
    def get_prizes(cls):
        return cls.PRIZES


class LastWinners(APIView):
    
    def get(self, request):
        winners = Winners.last_20_winners()
        winners_serializer = WinnersSerializers(winners, many=True)
        return Response(winners_serializer.data)

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
            user = User.objects.create_user(username = username, password = password1)
            user.save()
            user = authenticate(request, username=username, password=password1)
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        print(messages, username, password1, password2)
        return Response({"messages": messages})

        
