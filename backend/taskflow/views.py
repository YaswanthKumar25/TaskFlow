from rest_framework.generics import RetrieveUpdateDestroyAPIView,ListCreateAPIView,CreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import TaskFlow
from django.shortcuts import get_object_or_404
from .serializers import TaskFlowSerializers,RegisterSerializer
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework import status

class ListTasksApi(ListCreateAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=TaskFlowSerializers

    def get_queryset(self):
        return TaskFlow.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DetailApi(RetrieveUpdateDestroyAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=TaskFlowSerializers


    def get_queryset(self):
        return TaskFlow.objects.filter(user=self.request.user)

class RegisterApi(CreateAPIView):
    permission_classes=[AllowAny]
    serializer_class=RegisterSerializer


class LoginApi(APIView):
    def post(self,request):
        username=request.data.get("username")
        password=request.data.get('password')

        user=authenticate(username=username,password=password)

        if user:
            token,created=Token.objects.get_or_create(user=user)

            return Response({'token':token.key},
                            status=status.HTTP_200_OK
                            )
        
        return Response({"error":"invalid username or password"},
                        status=status.HTTP_401_UNAUTHORIZED
                        )


