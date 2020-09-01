from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated 
from rest_framework.authentication import TokenAuthentication
from pesticide_app.api.serializers import UserSerializer
from pesticide_app.permissions import  ReadOnlyPermissions
from pesticide_app.models import User

class UserByEnrNoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated & ReadOnlyPermissions]
    authentication_classes = [TokenAuthentication, ]
    lookup_field = 'enrollment_number'
