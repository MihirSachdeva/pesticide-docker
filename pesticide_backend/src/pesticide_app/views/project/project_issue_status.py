from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from pesticide_app.api.serializers import ProjectIssueStatusSerializer
from pesticide_app.models import Project


class ProjectIssueStatusViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returns a project's issues status tally.
    """
    serializer_class = ProjectIssueStatusSerializer
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [SessionAuthentication, ]
