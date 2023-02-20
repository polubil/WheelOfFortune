from django.contrib import admin
from backend import models

# Register your models here.

@admin.register(models.UserBalance)
class UserBalanceAdmin(admin.ModelAdmin):
    pass

@admin.register(models.VKToken)
class VKTokenAdmin(admin.ModelAdmin):
    pass

@admin.register(models.SocialAccount)
class SocialAccountAdmin(admin.ModelAdmin):
    pass

@admin.register(models.SocialNetwork)
class SocailNetworkAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Settings)
class SettingsAdmin(admin.ModelAdmin):
    list_display = ("key", "value", "description")