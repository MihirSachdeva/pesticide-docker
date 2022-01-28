from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from pesticide_app.permissions import ReadOnlyPermissions
from rest_framework.authentication import SessionAuthentication
from pesticide_app.api.serializers import WebhookSerializer
from pesticide_app.models import WebhookDetails


class WebhookDetailsView(APIView):
    permission_classes = [IsAuthenticated & ReadOnlyPermissions]
    authentication_classes = [SessionAuthentication, ]

    def get(self, request, pk, format = None):
        webhook = WebhookDetails.objects.get(project=pk)
        webhook_data = WebhookSerializer(webhook)
        return Response(webhook_data.data)
