from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from pesticide_app.permissions import ReadOnlyPermissions
from rest_framework.authentication import SessionAuthentication
from pesticide_app.api.serializers import WebhookFlaskSerializer
from pesticide_app.models import WebhookDetails


class WebhookFlaskView(APIView):
    permission_classes = [IsAuthenticated & ReadOnlyPermissions]
    authentication_classes = [SessionAuthentication, ]

    def get(self, request, pk, format=None):
        webhook = WebhookDetails.objects.get(identifier = pk)
        webhook_data = WebhookFlaskSerializer(webhook)
        return Response(webhook_data.data)
