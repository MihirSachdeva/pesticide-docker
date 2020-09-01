from rest_framework import serializers
from pesticide_app.models import EmailSubscription

class EmailSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailSubscription
        exclude = ('user',)
        read_only_fields = ('user',)
