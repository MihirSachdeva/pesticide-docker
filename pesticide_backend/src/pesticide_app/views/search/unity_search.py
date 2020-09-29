from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from pesticide_app.models import Issue, Project, User
from pesticide_app.api.serializers import ProjectSerializer, IssueSerializer, UserSerializer


class SearchView(APIView):
    """
    Search for issues, projects and users.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, ]

    def get(self, request):
        query = self.request.query_params.get('q', None)

        if query is not None:

            issue_query = Q(title__icontains=query)

            project_query = Q(name__icontains=query)

            user_query = Q(name__icontains=query)

            issue_results = IssueSerializer(
                Issue.objects.filter(issue_query).distinct(),
                many=True
            ).data

            project_results = ProjectSerializer(
                Project.objects.filter(project_query).distinct(),
                many=True
            ).data

            user_results = UserSerializer(
                User.objects.filter(user_query).distinct(),
                many=True
            ).data

            return Response({
                'issues': issue_results,
                'projects': project_results,
                'users': user_results
            })
        return Response({})
