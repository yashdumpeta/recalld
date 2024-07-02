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


#view for user data
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)
    return JsonResponse({
        'username': user.username,
        'access_token': access_token,
        'refresh_token': refresh_token,
    })


    
    
#this class basically develops a view that, when user is authenticated, he creates a 
#When an authenticated user makes a GET request to the endpoint associated with this view:
#The view will check if the user is authenticated.
#If authenticated, it will retrieve all Deck objects created by that user.
#These Deck objects will be serialized using the DeckSerializer.
#The serialized data will be returned as a JSON response.

class DeckCreate(generics.ListCreateAPIView):
    serializer_class = DeckSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Deck.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        


class DeckDelete(generics.DestroyAPIView):
    serializer_class = DeckSerializer
    permission_classes = [IsAuthenticated]
    
    def list_decks(self):
        creator = self.request.user
        return Deck.objects.filter(user = creator)
    
    
    