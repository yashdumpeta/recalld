from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# router = DefaultRouter()
# router.register(r'decks', views.DeckViewSet)
# router.register(r'cards', views.CardViewSet)
# path('', include(router.urls)),
urlpatterns = [
    path('register/', views.CreateUserView.as_view(), name='register'),
    path("deck/", views.DeckCreate.as_view(), name="deck-list"), #url for creating or looking at list of decks
    path("deck/delete/<int:pk>/", views.DeckDelete.as_view(), name="deck-delete"), #url for deleting a deck
] 