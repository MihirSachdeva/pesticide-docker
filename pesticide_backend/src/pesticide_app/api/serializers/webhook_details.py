from django.core.serializers import serialize
from rest_framework import serializers
from pesticide_app.models import WebhookDetails

class WebhookSerializer(serializers.ModelSerializer):

    class Meta:
        model = WebhookDetails
        fields = '__all__'

class WebhookFlaskSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = WebhookDetails
        fields = ['name','repository_name','ssh_url','path','secret','branch','identifier']

class WebhookDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = WebhookDetails
        fields = ['id','name','repository_name','ssh_url','path','branch','identifier','project','creator','timestamp']




