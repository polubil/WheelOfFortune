from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Winners(models.Model):

    winner = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Победитель")
    winning_amount = models.IntegerField(verbose_name="Сумма выигрыша")
    win_date = models.DateTimeField(auto_now_add=True, verbose_name="Дата и время выигрыша")

    def last_20_winners():
        return Winners.objects.filter().order_by("-win_date")[:6]

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

# Create your models here.
