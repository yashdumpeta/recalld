from rest_framework import serializers
from .models import Deck, Card
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    #ensures proper account creation upon validated_data that passes serializer's validation process. 
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class DeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = ['id', 'deck_name', 'description', 'time_created', 'last_updated']
        read_only_fields = ['id', 'time_created', 'last_updated', 'user']

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'deck', 'created_at', 'updated_at', 'front_side', 'back_side']
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']
        
