from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated 
from rest_framework.authentication import TokenAuthentication
from pesticide_app.api.serializers import ProjectNameSlugSerializer
from pesticide_app.permissions import  ReadOnlyPermissions
from pesticide_app.models import Project

class ProjectNameSlugViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectNameSlugSerializer
    queryset = Project.objects.all()    
    permission_classes = [IsAuthenticated & ReadOnlyPermissions]
    authentication_classes = [TokenAuthentication, ]
