from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from pesticide_app.api.serializers import TagSerializer
from pesticide_app.permissions import AdminOrReadOnlyPermisions
from pesticide_app.models import Tag


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all().order_by("color")
    permission_classes = [IsAuthenticated & AdminOrReadOnlyPermisions]
    authentication_classes = [SessionAuthentication, ]
