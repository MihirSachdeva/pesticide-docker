from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from pesticide_app.permissions import ProjectMemberOrAdmin
from rest_framework.authentication import SessionAuthentication
from pesticide_app.api.serializers import WebhookSerializer
from pesticide_app.models import WebhookDetails


class WebhookViewSet(viewsets.ModelViewSet):
    serializer_class = WebhookSerializer
    queryset = WebhookDetails.objects.all()
    permission_classes = [IsAuthenticated & ProjectMemberOrAdmin ]
    authentication_classes = [SessionAuthentication, ]

