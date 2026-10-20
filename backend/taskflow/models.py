from django.db import models
from django.contrib.auth.models import User

class TaskFlow(models.Model):
    STATUS_CHOICES=(
        ('pending','pending'),
        ('completed','completed'),
        ('in_progress','in_progress')
    )
    PRIORITY_CHOICES=(
        ('low','Low'),
        ('medium','Medium'),
        ('high','High')
        )
    
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    title=models.CharField(max_length=100)
    description=models.TextField(default='No Description')
    due_date=models.DateTimeField()
    status=models.CharField(choices=STATUS_CHOICES,default='pending')
    priority=models.CharField(choices=PRIORITY_CHOICES,default='medium')
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
