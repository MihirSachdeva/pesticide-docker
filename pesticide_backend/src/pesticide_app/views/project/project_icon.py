from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated 
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authentication import SessionAuthentication
from pesticide_app.api.serializers import ProjectIconSerializer
from pesticide_app.permissions import  ImageProjectCreatorMembersPermissions, AdminOrSafeMethodsPostPermissions
from pesticide_app.models import ProjectIcon

class ProjectIconViewSet(viewsets.ModelViewSet):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = ProjectIconSerializer
    queryset = ProjectIcon.objects.all()
    permission_classes = [IsAuthenticated & (ImageProjectCreatorMembersPermissions | AdminOrSafeMethodsPostPermissions)]
    authentication_classes = [SessionAuthentication, ]
