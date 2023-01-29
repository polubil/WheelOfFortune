from django.contrib import admin
from django.urls import path, include
from .views import index, UserBalanceAPI, Spinner, Prizes, LastWinners, LoginChecker, Login, Register

urlpatterns = [
    path('admin/', admin.site.urls),
    path('API/UserBalance', UserBalanceAPI.as_view(), name="DRF"),
    path('API/Spinner', Spinner.as_view(), name="DRF"),
    path('API/Prizes', Prizes.as_view(), name="DRF"),
    path('API/Last20Winners', LastWinners.as_view(), name="DRF"),
    path('API/LoginChecker', LoginChecker.as_view(), name="DRF"),
    path('API/Login', Login.as_view(), name="DRF"),
    path('API/SignUp', Register.as_view(), name="DRF"),
    path('', index.as_view(), name="index")
]