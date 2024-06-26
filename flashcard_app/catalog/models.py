from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Deck(models.Model):
    deck_name = models.CharField(blank=False, max_length=100)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pass