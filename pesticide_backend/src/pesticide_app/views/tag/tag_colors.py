from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from pesticide_app.permissions import ReadOnlyPermissions
from pesticide_app.models import Tag


class TagColorsView(APIView):
    permission_classes = [IsAuthenticated & ReadOnlyPermissions]
    authentication_classes = [TokenAuthentication, ]

    def get(self, request):
        colors = set()
        tags = Tag.objects.all()
        for tag in tags:
            colors.add(tag.color)
        colors = list(colors)
        return Response(
            {'colors': colors},
            status=status.HTTP_200_OK
        )
