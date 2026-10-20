from django.urls import path
from . import  views

urlpatterns = [
    path("",views.ListTasksApi.as_view(),name='tasklist'),
    path("<int:pk>/",views.DetailApi.as_view(),name='details'),
    path("register/",views.RegisterApi.as_view(), name="register"),
    path('login/',views.LoginApi.as_view(),name='login'),
]
