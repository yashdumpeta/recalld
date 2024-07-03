from django.shortcuts import render
from rest_framework import viewsets, generics, status
from .models import Deck, Card
from .serializers import DeckSerializer, CardSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

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
    
    
    def get_queryset(self):
        return Deck.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != self.request.user:
            return Response({"detail": "You do not have permission to delete this deck."}, 
                status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(instance)
        return Response({"detail": "Deck deleted successfully."}, 
                        status=status.HTTP_204_NO_CONTENT)
    
    

class DeckUpdate(generics.UpdateAPIView):
    serializer_class = DeckSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Deck.objects.filter(user = self.request.user)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object() # gets the object that user wants to update
        serializer = self.get_serializer(instance, data=request.data, partial=True) #makes a serializer instance, and uses partial=True to say that not all args are needed
        serializer.is_valid(raise_exception=True) #checks if its valid with serializers expectations
        self.perform_update(serializer) #saves updated instance to db
        return Response(serializer.data) #returns response


class DeckRetrieve(generics.RetrieveAPIView):
    serializer_class = DeckSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Deck.objects.filter(user=self.request.user)
    


class CardListCreate(generics.ListCreateAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self): 
        url_deck_id = self.kwargs.get('deck_id') #get the deck id from the URL keyword args
        return Card.objects.filter(deck_id=url_deck_id, deck__user=self.request.user)

    def perform_create(self, serializer):
        deck_id = self.kwargs.get('deck_id') #extracts deck_id from the URL keyword args (kwargs) (assuming url has deck_id parameter)
        deck = Deck.objects.get(id = deck_id, user = self.request.user)
        serializer.save(deck=deck, user=self.request.user)

    
class CardDelete(generics.DestroyAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(deck__user=self.request.user)
    

class CardUpdate(generics.UpdateAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(deck__user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
class CardRetrieve(generics.RetrieveAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(deck__user = self.request.user)