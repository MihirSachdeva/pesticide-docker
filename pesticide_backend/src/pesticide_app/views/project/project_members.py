
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from pesticide_app.api.serializers import ProjectMembersSerializer
from pesticide_app.models import Project


class ProjectMembers(viewsets.ReadOnlyModelViewSet):
    """
    Returns a project's members and also other users of the app.
    """
    serializer_class = ProjectMembersSerializer
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [SessionAuthentication, ]
