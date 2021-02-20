from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from pesticide_app.api.serializers import EmoticonSerializer
from pesticide_app.permissions import AdminOrReadOnlyPermisions
from pesticide_app.models import Emoticon


class EmoticonViewSet(viewsets.ModelViewSet):
    serializer_class = EmoticonSerializer
    queryset = Emoticon.objects.all()
    permission_classes = [IsAuthenticated & AdminOrReadOnlyPermisions]
    authentication_classes = [SessionAuthentication, ]
