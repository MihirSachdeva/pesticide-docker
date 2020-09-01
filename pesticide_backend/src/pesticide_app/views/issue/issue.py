import os
import threading
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.filters import SearchFilter
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from pesticide_app.pagination import StandardResultsSetPagination
from pesticide_app.api.serializers import IssueSerializer
from pesticide_app.permissions import IssueCreatorPermissions, IssueProjectCreatorOrMembers, AdminOrReadOnlyPermisions
from pesticide_app.models import Issue, IssueStatus, User
from pesticide_app.mailing import new_issue_reported, issue_status_update, issue_assigned
from slugify import slugify


class IssueViewSet(viewsets.ModelViewSet):
    serializer_class = IssueSerializer
    queryset = Issue.objects.all()
    permission_classes = [IsAuthenticated & (
        IssueCreatorPermissions | IssueProjectCreatorOrMembers | AdminOrReadOnlyPermisions)]
    authentication_classes = [TokenAuthentication, ]
    pagination_class = StandardResultsSetPagination
    filter_backends = (DjangoFilterBackend, SearchFilter)
    search_fields = ['title']
    filterset_fields = ['project', 'reporter', 'assigned_to', 'tags', 'status__type']

    def create(self, request, *args, **kwargs):
        issue = request.data
        issue['reporter'] = request.user.id
        serializer = IssueSerializer(data=issue)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        issue = serializer.save()
        projectPageLink = "http://127.0.0.1:3000/projects/" + \
            slugify(issue.project.name)
        email_notification = threading.Thread(
            target=new_issue_reported,
            args=(
                issue.project.name,
                projectPageLink,
                issue.reporter.name,
                issue.title,
                issue.tags.all(),
                issue.project.members.all()
            )
        )
        email_notification.start()

    @action(
        methods=['patch', ],
        detail=True,
        url_path='update-issue-status',
        url_name='update-issue-status',
        permission_classes=[IsAuthenticated & (
            IssueProjectCreatorOrMembers | AdminOrReadOnlyPermisions)],
        authentication_classes=[TokenAuthentication]
    )
    def update_issue_status(self, request, pk):
        """
        Update the status of an issue. Provide the id of a valid IssueStatus in request.
        """
        issue = get_object_or_404(Issue, pk=pk)
        user = request.user
        if (user.is_master or user == issue.project.creator or user in issue.project.members.all()):
            try:
                new_status = IssueStatus.objects.get(
                    id=self.request.data['status'])
            except:
                return Response(
                    {'message': 'Please provide a valid issue status id.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            old_status = issue.status
            if old_status != new_status:
                issue.status = new_status
                issue.save()
                status_updated_by = user
                projectPageLink = "http://127.0.0.1:3000/projects/" + \
                    slugify(issue.project.name)
                email_notification = threading.Thread(
                    target=issue_status_update,
                    args=(
                        issue.project.name,
                        projectPageLink,
                        issue.title,
                        # old_status temporarily set as IssueStatus of id = 1...
                        IssueStatus.objects.get(id=1),
                        new_status,
                        status_updated_by,
                        issue.reporter,
                        issue.project.members.all()
                    )
                )
                email_notification.start()
            serializer = IssueSerializer(issue)
            return Response(serializer.data)
        else:
            return Response(
                {'message': 'You do not have permission to perform this action'},
                status=status.HTTP_401_UNAUTHORIZED
            )

    @action(
        methods=['patch', ],
        detail=True,
        url_path='issue-assign',
        url_name='issue-assign',
        permission_classes=[IsAuthenticated & (
            IssueProjectCreatorOrMembers | AdminOrReadOnlyPermisions)],
        authentication_classes=[TokenAuthentication]
    )
    def issue_assign(self, request, pk):
        """
        Update the assignee of an issue. Provide the id of a valid user in request to assign them an issue.
        """
        issue = get_object_or_404(Issue, pk=pk)
        user = request.user
        if (user.is_master or user == issue.project.creator or user in issue.project.members.all()):
            previous_assignee = issue.assigned_to
            try:
                assignee_id = self.request.data['assigned_to']
            except:
                return Response(
                    {'message': 'User id of issuee assignee not provided.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            try:
                assigned_to = User.objects.get(id=assignee_id)
            except:
                return Response(
                    {'message': 'Invalid user id of issue assignee provided.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            assigned_by = request.user
            projectPageLink = "http://127.0.0.1:3000/projects/" + \
                slugify(issue.project.name)
            if assigned_to and assigned_to != previous_assignee:
                issue.assigned_to = assigned_to
                issue.save()
                email_notification_for_assignee = threading.Thread(
                    target=issue_assigned,
                    args=(
                        issue.project.name,
                        projectPageLink,
                        issue.title,
                        issue.tags.all(),
                        assigned_to,
                        assigned_by
                    )
                )
                email_notification_for_assignee.start()
            serializer = IssueSerializer(issue)
            return Response(serializer.data)
        else:
            return Response(
                {'message': 'You do not have permission to perform this action'},
                status=status.HTTP_401_UNAUTHORIZED
            )
