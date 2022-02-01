from django.http import HttpResponse
from django.forms.models import model_to_dict
from django.http import JsonResponse
from rest_framework.views import APIView
from pesticide_app.models import WebhookDetails

class WebhookFlaskView(APIView):
    # permission_classes = [IsAuthenticated & ReadOnlyPermissions]
    # authentication_classes = [SessionAuthentication, ]

    def get(self, request, pk, format=None):

        if(request.headers['Token']=='123'):
            webhook = WebhookDetails.objects.get(identifier = pk)
            return JsonResponse(model_to_dict(webhook))
        return HttpResponse("Unauthenticated")

