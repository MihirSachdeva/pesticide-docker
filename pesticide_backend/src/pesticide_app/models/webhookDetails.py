from django.db import models
from pesticide_app.models.project import Project
from pesticide_app.models.user import User
from datetime import datetime     

class WebhookDetails(models.Model):
   
    name = models.CharField(max_length=100, unique=True)
    repository_name = models.CharField(max_length=500)
    ssh_url = models.CharField(max_length=1000)
    path = models.CharField(max_length=1000) #wrt omniport codebase
    secret = models.CharField(max_length=1000)
    branch = models.CharField(max_length=1000)
    identifier = models.CharField(max_length=100, unique=True) #used to identify webhook url
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='webhooks')
    creator = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='webhook_creator')
    timestamp = models.DateTimeField(default=datetime.now, blank=True, null=True)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-timestamp']