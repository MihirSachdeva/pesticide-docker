from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.filters import SearchFilter
from pesticide_app.api.serializers import IssueSearchSerializer
from pesticide_app.models import Issue


class IssueSearchViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = IssueSearchSerializer
    queryset = Issue.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, ]
    filter_backends = (SearchFilter, )
    search_fields = ['title']
