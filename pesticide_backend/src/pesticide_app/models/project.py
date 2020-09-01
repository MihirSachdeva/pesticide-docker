from django.db import models
from djrichtextfield.models import RichTextField
from pesticide_app.models.user import User
from datetime import datetime   

class Project(models.Model):
    ProjectStatusChoices = [
        ('Testing', 'Testing'), 
        ('Deployed', 'Deployed'), 
        ('Production', 'Production'), 
        ('Development', 'Development'), 
        ('Scrapped', 'Scrapped'), 
        ('Finished', 'Finished')
    ]

    name = models.CharField(max_length=50, unique=True)
    wiki = RichTextField(blank=True, null=True)
    timestamp = models.DateTimeField(default=datetime.now, blank=True, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='creator')
    link = models.URLField(default='', blank=True, null=True)
    members = models.ManyToManyField(User, related_name='project_member_related', related_query_name='project_member', blank=True)
    status = models.CharField(max_length=20, choices=ProjectStatusChoices, default="Testing", blank=True, null=True)

    def __str__(self):
        return self.name
    
    def get_latest_projects():
        return Project.objects.order_by('-timestamp').all()[:5]

    class Meta:
        ordering = ['-timestamp']