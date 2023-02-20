from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Winners(models.Model):

    winner = models.ForeignKey("backend.MyUser", on_delete=models.CASCADE, verbose_name="Победитель")
    winning_amount = models.IntegerField(verbose_name="Сумма выигрыша")
    win_date = models.DateTimeField(auto_now_add=True, verbose_name="Дата и время выигрыша")

    def last_20_winners():
        return Winners.objects.filter().order_by("-win_date")[:20]

class UserBalance(models.Model):

    user = models.OneToOneField(User, verbose_name=("Баланс"), on_delete=models.CASCADE)
    balance = models.IntegerField(verbose_name="Баланс", default=1000)

    def get_user_info(self):
        return [self.user, self.balance]

    def spend_balance(self, amount):
        self.balance -= amount
        self.save()

    def add_balance(self, amount):
        self.balance += amount
        self.save()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserBalance.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userbalance.save()


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
# Create your models here.

class Settings(models.Model):
    key = models.CharField(max_length=50)
    value = models.CharField(max_length=500)
    description = models.CharField(blank=True, null=True, max_length=1000)


class MyUser(User):
    class Meta:
        proxy = True

    def __str__(self):
        return f'{self.first_name} {self.last_name}' 