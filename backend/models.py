from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from VKAuth import models as vkauth_models
from . import utils

class Winners(models.Model):


    winner = models.ForeignKey("backend.UserProfile", on_delete=models.CASCADE, verbose_name="Победитель")
    winning_amount = models.IntegerField(verbose_name="Сумма выигрыша")
    win_date = models.DateTimeField(auto_now_add=True, verbose_name="Дата и время выигрыша")


    def last_20_winners():
        return Winners.objects.filter().extra().order_by("-win_date")[:20]


class UserProfile(models.Model):


    user = models.OneToOneField(User, verbose_name=("Пользователь"), on_delete=models.CASCADE)
    balance = models.IntegerField(verbose_name="Баланс", default=1000)
    picture = models.ImageField()
    

    def set_picture(self, picture_path):
        self.picture = picture_path
        print("done")


    def get_user_balance(self):
        print(self.user.first_name)
        return self.balance
    

    def get_username(self):
        return self.user.username
    

    def spend_balance(self, amount):
        self.balance -= amount
        self.save()


    def add_balance(self, amount):
        self.balance += amount
        self.save()


    def generate_picture(user):
        path = "frontend/static/frontend/images/pictures"
        text = user.first_name[0] + user.last_name[0]
        username = user.username
        picture_path = utils.create_svg(path, username, text)
        print(picture_path)
        return picture_path

    def __str__(self):
        return "%s %s" % (self.user.first_name, self.user.last_name)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        up = UserProfile.objects.create(user=instance, picture=UserProfile.generate_picture(instance))
        up.save()


class MyUser(User):

    class Meta:
        proxy = True

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    
    def send_pizza(self, toppings, size):
        pizza_done.send(sender=self.__class__, toppings=toppings, size=size)
        ...
    