from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated 
from rest_framework.authentication import TokenAuthentication
from pesticide_app.api.serializers import IssueImageSerializer
from pesticide_app.permissions import  AdminOrSafeMethodsPostPermissions
from pesticide_app.models import IssueImage

class IssueImageViewSet(viewsets.ModelViewSet):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = IssueImageSerializer
    queryset = IssueImage.objects.all()
    permission_classes = [IsAuthenticated & AdminOrSafeMethodsPostPermissions]
    authentication_classes = [TokenAuthentication, ]
