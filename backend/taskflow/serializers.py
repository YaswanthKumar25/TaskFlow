from rest_framework import serializers
from .models import TaskFlow
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password



class TaskFlowSerializers(serializers.ModelSerializer):
    class Meta:
        model=TaskFlow
        fields=['id','title','description','due_date','status','priority','user','created_at','updated_at']
        read_only_fields=['user','created_at','updated_at']


    def validate_due_date(self,value):
        if value <= timezone.now():
            raise serializers.ValidationError(
        "Due date must be in the future.")
        return value

    
    def validate_title(self,value):
        if len((value.strip()))<3:
            raise serializers.ValidationError("Title Must be atleast 3 letters")
        return value

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['username','password']
        extra_kwargs={
            'password':{'write_only':True}
        }

    def create(self,validate_data):
        return User.objects.create_user(**validate_data)

    def validate_password(self,value):
        validate_password(value)
        return value