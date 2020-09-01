from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated 
from rest_framework.authentication import TokenAuthentication
from pesticide_app.api.serializers import EmailSubscriptionSerializer
from pesticide_app.permissions import  UserSelfPermissions
from pesticide_app.models import EmailSubscription

class EmailSubscriptionViewset(viewsets.ModelViewSet):
    serializer_class = EmailSubscriptionSerializer
    queryset = EmailSubscription.objects.all()
    permission_classes = [IsAuthenticated  & UserSelfPermissions]
    authentication_classes = [TokenAuthentication, ]
