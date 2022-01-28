from django.core.serializers import serialize
from rest_framework import serializers
from pesticide_app.models import WebhookDetails, Project, ProjectIcon, User, IssueStatus, Issue
from slugify import slugify
from .project import ProjectNameSlugSerializer

class WebhookSerializer(serializers.ModelSerializer):

    class Meta:
        model = WebhookDetails
        fields = '__all__'

class WebhookFlaskSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = WebhookDetails
        fields = ['name','repository_name','ssh_url','path','secret','branch','identifier']





