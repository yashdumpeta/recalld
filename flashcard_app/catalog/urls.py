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
    path("decks/<int:pk>/delete/", views.DeckDelete.as_view(), name="deck-delete"),
    path('decks/<int:pk>/', views.DeckRetrieve.as_view(), name='deck-retrieve'),
    path('decks/<int:pk>/update/', views.DeckUpdate.as_view(), name='deck-update'),
    path('decks/<int:pk>/delete/', views.DeckDelete.as_view(), name='deck-delete'),
    path('decks/<int:deck_id>/cards/', views.CardListCreate.as_view(), name='card-list-create'),
    path('cards/<int:pk>/', views.CardRetrieve.as_view(), name='card-retrieve'),
    path('cards/<int:pk>/update/', views.CardUpdate.as_view(), name='card-update'),
    path('cards/<int:pk>/delete/', views.CardDelete.as_view(), name='card-delete'),
]