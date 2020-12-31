import os
import threading
from datetime import datetime
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.filters import SearchFilter
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from pesticide_app.pagination import StandardResultsSetPagination
from pesticide_app.api.serializers import IssueSerializer
from pesticide_app.permissions import IssueCreatorPermissions, IssueProjectCreatorOrMembers, AdminOrReadOnlyPermisions
from pesticide_app.models import Issue, IssueStatus, User, Tag, IssueImage, Project
from pesticide_app.mailing import new_issue_reported, issue_status_update, issue_assigned
from slugify import slugify
from pesticide.settings import FRONTEND_URL


class IssueViewSet(viewsets.ModelViewSet):
    serializer_class = IssueSerializer
    queryset = Issue.objects.all()
    permission_classes = [IsAuthenticated & (
        IssueCreatorPermissions | IssueProjectCreatorOrMembers | AdminOrReadOnlyPermisions)]
    authentication_classes = [SessionAuthentication, ]
    pagination_class = StandardResultsSetPagination
    filter_backends = (DjangoFilterBackend, SearchFilter)
    search_fields = ['title']
    filterset_fields = ['project', 'reporter',
                        'assigned_to', 'status__type']

    def get_queryset(self):
        issues = self.queryset
        query_tag_ids = self.request.GET.get('tags', '')
        if len(query_tag_ids):
            query_tag_ids_list = query_tag_ids.split(',')
            query_tags_set = set(Tag.objects.filter(id__in=query_tag_ids_list))
            filtered_issues = []
            for issue in issues:
                tags = issue.tags.all()
                if query_tags_set.issubset(set(tags)):
                    filtered_issues.append(issue.id)
            return issues.filter(id__in=filtered_issues)
        return issues

    def create(self, request, *args, **kwargs):
        post_data = request.POST
        title = post_data.get('title')
        if ((title is not None) & (len(title) != 0)):
            issue_image = request.FILES.get('image')
            project_id = post_data.get('project')
            description = post_data.get('description')
            post_data_copy = post_data.copy()
            post_data_copy.pop('project')
            post_data_copy.pop('tags')
            post_data_copy.pop('title')
            post_data_copy.pop('description')
            project = Project.objects.get(pk=project_id)
            issue = Issue.objects.create(
                project=project,
                title=title,
                description=description,
                timestamp=datetime.now(),
                reporter=request.user,
                **post_data_copy,
            )
            tags = post_data.get('tags')
            if ((tags is not None) & (len(tags) != 0)):
                tags_id_list = tags.split(',')
                tags_list = list(Tag.objects.filter(id__in=tags_id_list))
                issue.tags.set(tags_list)
            if issue_image is not None:
                IssueImage.objects.create(issue=issue, image=issue_image)

            projectPageLink = f"{FRONTEND_URL}/projects/{slugify(issue.project.name)}/issues/{issue.id}"
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

            return Response('Issue created.', status=status.HTTP_201_CREATED)
        return Response('Title of issue cannot be empty.', status=status.HTTP_400_BAD_REQUEST)

    @action(
        methods=['patch', ],
        detail=True,
        url_path='update-issue-status',
        url_name='update-issue-status',
        permission_classes=[IsAuthenticated & (
            IssueProjectCreatorOrMembers | AdminOrReadOnlyPermisions)],
        authentication_classes=[SessionAuthentication]
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
                projectPageLink = f"{FRONTEND_URL}/projects/{slugify(issue.project.name)}/issues/{issue.id}"
                email_notification = threading.Thread(
                    target=issue_status_update,
                    args=(
                        issue.project.name,
                        projectPageLink,
                        issue.title,
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
        authentication_classes=[SessionAuthentication]
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
            projectPageLink = f"{FRONTEND_URL}/projects/{slugify(issue.project.name)}/issues/{issue.id}"
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
