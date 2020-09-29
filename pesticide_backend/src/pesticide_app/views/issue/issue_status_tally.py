from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated 
from rest_framework.authentication import SessionAuthentication
from pesticide_app.api.serializers import IssueStatusTallySerializer
from pesticide_app.permissions import  AdminOrReadOnlyPermisions, ReadOnlyPermissions
from pesticide_app.models import IssueStatus

class IssueStatusTallyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = IssueStatusTallySerializer
    queryset = IssueStatus.objects.all()
    permission_classes = [IsAuthenticated & ReadOnlyPermissions]
    authentication_classes = [SessionAuthentication, ]
