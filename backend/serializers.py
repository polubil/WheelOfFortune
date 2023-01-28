from rest_framework import serializers
from .models import Winners, UserBalance

class WinnersSerializers(serializers.Serializer):
    id = serializers.IntegerField()
    winner = serializers.CharField(max_length=100)
    winning_amount = serializers.IntegerField()
    win_date = serializers.DateTimeField()