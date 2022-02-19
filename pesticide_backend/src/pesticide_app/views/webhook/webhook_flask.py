from django.http import HttpResponse
from django.forms.models import model_to_dict
from django.http import JsonResponse
from rest_framework.views import APIView
from pesticide_app.models import WebhookDetails
from pesticide_app.permissions import IsFlaskRequest

class WebhookFlaskView(APIView):
    permission_classes = [IsFlaskRequest]

    def get(self, request, pk, format=None):
        try:
            webhook = WebhookDetails.objects.get(identifier = pk)
            return JsonResponse(model_to_dict(webhook))
        except:
            return HttpResponse("No matching query")

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [IsFlaskRequest]
        return super(WebhookFlaskView, self).get_permissions()