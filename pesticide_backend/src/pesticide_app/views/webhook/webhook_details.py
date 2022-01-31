from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from pesticide_app.permissions import ReadOnlyPermissions
from rest_framework.authentication import SessionAuthentication
from pesticide_app.api.serializers import WebhookDetailsSerializer
from pesticide_app.models import WebhookDetails, Project


class WebhookDetailsView(APIView):
    permission_classes = [IsAuthenticated & ReadOnlyPermissions]
    authentication_classes = [SessionAuthentication, ]

    def get(self, request, pk, format = None):
        project = Project.objects.get(id=pk)
        webhook_data = WebhookDetailsSerializer(project.webhooks.all(),many=True)
        return Response(webhook_data.data)
