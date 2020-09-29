from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from pesticide_app.api.serializers import UserStatusSerializer
from pesticide_app.permissions import AdminOnlyPermisions
from pesticide_app.models import User


class UserStatusViewset(viewsets.ModelViewSet):
    serializer_class = UserStatusSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated & AdminOnlyPermisions]
    authentication_classes = [SessionAuthentication, ]
