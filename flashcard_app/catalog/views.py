from django.shortcuts import render
from rest_framework import viewsets, generics
from .models import Deck, Card
from .serializers import DeckSerializer, CardSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() #this is for all the different user objects that we are looking at when creating a new one
    serializer_class = UserSerializer #tells the view what kind of data needed to make a user
    permission_classes = [AllowAny] #who can call this

# Create your views here.
class DeckViewSet(viewsets.ModelViewSet):
    queryset = Deck.objects.all()
    serializer_class = DeckSerializer
    
class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer  