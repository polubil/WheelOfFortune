from django.db import models
from django.contrib.auth.models import User

class VKToken(models.Model):
    id = models.IntegerField(null=False, unique=True, primary_key=True)
    token = models.CharField(unique=True, max_length=250)
    expires = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)


class SocialNetwork(models.Model):
    title = models.CharField(max_length=10)


class SocialAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    network = models.ForeignKey(SocialNetwork, on_delete=models.CASCADE)


class Settings(models.Model):
    key = models.CharField(max_length=50)
    value = models.CharField(max_length=500)
    description = models.CharField(blank=True, null=True, max_length=1000)
