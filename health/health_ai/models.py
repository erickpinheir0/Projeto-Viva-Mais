from django.db import models
from django.utils import timezone

class Message(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.content[:50] 

# Create your models here.
