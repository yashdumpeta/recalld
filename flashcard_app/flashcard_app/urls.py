"""
URL configuration for flashcard_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from catalog.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView #pre-built views that help access access and refresh tokens

urlpatterns = [
    path("admin/", admin.site.urls),
    path("catalog/user/register/", CreateUserView.as_view(), name="register"), #when we go to this root, it will call createuser view and helps us reate user
    path("catalog/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("catalog/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("catalog-auth/", include("rest_framework.urls")),
    path('catalog/', include('catalog.urls')),
]
