from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated 
from rest_framework.authentication import TokenAuthentication
from pesticide_app.api.serializers import UserLoggedInSerializer
from pesticide_app.models import User

class UserLoggedInViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserLoggedInSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, ]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
