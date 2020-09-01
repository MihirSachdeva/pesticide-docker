from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from pesticide_app.permissions import ReadOnlyPermissions
from pesticide_app.models import IssueStatus


class IssueStatusColorsView(APIView):
    permission_classes = [IsAuthenticated & ReadOnlyPermissions]
    authentication_classes = [TokenAuthentication, ]

    def get(self, request):
        colors = set()
        issue_statuses = IssueStatus.objects.all()
        for issue_status in issue_statuses:
            colors.add(issue_status.color)
        colors = list(colors)
        return Response(
            {'colors': colors},
            status=status.HTTP_200_OK
        )
