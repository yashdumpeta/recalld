from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# router = DefaultRouter()
# router.register(r'decks', views.DeckViewSet)
# router.register(r'cards', views.CardViewSet)
# path('', include(router.urls)),

urlpatterns = [
    path('register/', views.CreateUserView.as_view(), name='register'),
    path("decks/", views.DeckCreate.as_view(), name="deck-list-create"),  # URL for creating or listing decks
    path("decks/<int:pk>/", views.DeckDelete.as_view(), name="deck-delete"),  # URL for deleting a specific deck
]