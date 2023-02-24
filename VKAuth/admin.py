from django.contrib import admin
from VKAuth import models

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
