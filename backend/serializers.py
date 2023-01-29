from rest_framework import serializers

class UserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)

class ProfileSerializer(serializers.Serializer):
    user = UserSerializer()
    picture = serializers.ImageField()

class WinnersSerializers(serializers.Serializer):
    id = serializers.IntegerField()
    winner = ProfileSerializer()
    winning_amount = serializers.IntegerField()
    win_date = serializers.DateTimeField()