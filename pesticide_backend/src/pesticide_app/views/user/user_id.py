from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated 
from rest_framework.authentication import SessionAuthentication
from pesticide_app.api.serializers import UserSerializer
from pesticide_app.models import User

class UserIdViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, ]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
