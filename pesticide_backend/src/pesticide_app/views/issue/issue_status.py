from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from pesticide_app.api.serializers import IssueStatusSerializer
from pesticide_app.permissions import AdminOrReadOnlyPermisions
from pesticide_app.models import IssueStatus


class IssueStatusViewSet(viewsets.ModelViewSet):
    serializer_class = IssueStatusSerializer
    queryset = IssueStatus.objects.all().order_by('-type')
    permission_classes = [IsAuthenticated & AdminOrReadOnlyPermisions]
    authentication_classes = [TokenAuthentication, ]
