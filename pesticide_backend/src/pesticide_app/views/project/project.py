import os
import threading
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from pesticide_app.api.serializers import ProjectSerializer
from pesticide_app.permissions import ProjectCreatorMembersPermissions, AdminOrReadOnlyPermisions
from pesticide_app.models import Project, User
from pesticide_app.mailing import add_project_member, project_status_update, new_project_added
from slugify import slugify


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticated & (
        ProjectCreatorMembersPermissions | AdminOrReadOnlyPermisions)]
    authentication_classes = [TokenAuthentication, ]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['members']
    search_fields = ['name']

    def create(self, request, *args, **kwargs):
        project = request.data
        project['creator'] = request.user.id
        serializer = ProjectSerializer(data=project)
        if serializer.is_valid():
            project_slug = slugify(project['name'])
            slugs = []
            for p in Project.objects.all():
                slugs.append(slugify(p.name))
            if project_slug in slugs:
                return Response(
                    {"message": "Project names should be strictly unique."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        project = serializer.save()
        projectPageLink = "http://127.0.0.1:3000/projects/" + \
            slugify(project.name)
        email_notification = threading.Thread(
            target=new_project_added,
            args=(
                project.name,
                project.link,
                projectPageLink,
                project.creator,
                project.members.all(),
                project.status,
                User.objects.all()
            )
        )
        email_notification.start()

    @action(
        methods=['patch', ],
        detail=True,
        url_path='update-project-status',
        url_name='update-project-status',
        permission_classes=[IsAuthenticated & (
            ProjectCreatorMembersPermissions | AdminOrReadOnlyPermisions)],
        authentication_classes=[TokenAuthentication]
    )
    def update_project_status(self, request, pk):
        project = Project.objects.get(pk=pk)
        user = self.request.user
        if (user.is_master or user == project.creator or user in project.members.all()):
            old_status = project.status
            try:
                new_status = self.request.data['status']
            except KeyError:
                return Response(
                    {'message': 'New status not provided for the project.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if new_status != old_status:
                project.status = new_status
                project.save()
                status_updated_by = user
                projectPageLink = "http://127.0.0.1:3000/projects/" + \
                    slugify(project.name)
                email_notification = threading.Thread(
                    target=project_status_update,
                    args=(
                        project.name,
                        project.link,
                        projectPageLink,
                        old_status,
                        new_status,
                        status_updated_by,
                        User.objects.all()
                    )
                )
                email_notification.start()
            serializer = ProjectSerializer(project)
            return Response(serializer.data)
        else:
            return Response(
                {'message': 'You do not have permission to perform this action'},
                status=status.HTTP_401_UNAUTHORIZED
            )

    @action(
        methods=['patch', ],
        detail=True,
        url_path='update-project-members',
        url_name='update-project-members',
        permission_classes=[IsAuthenticated & (
            ProjectCreatorMembersPermissions | AdminOrReadOnlyPermisions)],
        authentication_classes=[TokenAuthentication]
    )
    def update_project_members(self, request, pk):
        project = Project.objects.get(pk=pk)
        user = self.request.user
        if (user.is_master or user == project.creator or user in project.members.all()):
            old_member_list = list(project.members.all())

            try:
                members = self.request.data['members']
            except KeyError:
                return Response(
                    {'message': 'No member list provided.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if len(members) == 0:
                serializer = ProjectSerializer(project)
                return Response(serializer.data)

            if set(old_member_list) != set(members):
                new_member_list = list(set(members))
                for i in range(len(new_member_list)):
                    new_member_list[i] = User.objects.get(
                        id=new_member_list[i])
                members_to_be_added = list(
                    set(new_member_list).difference(set(old_member_list)))
                # members_to_be_removed = list(set(old_member_list).difference(set(new_member_list)))
                project.members.set(new_member_list)
                project.save()
                projectPageLink = "http://127.0.0.1:3000/projects/" + \
                    slugify(project.name)
                # can also send email to those who have been removed from the project (members_to_be_removed)
                # but not implementing this for now.
                email_notification = threading.Thread(
                    target=add_project_member,
                    args=(
                        project.name,
                        project.link,
                        projectPageLink,
                        user.name,
                        project.members.all(),
                        project.status,
                        members_to_be_added
                    )
                )
                email_notification.start()
            serializer = ProjectSerializer(project)
            return Response(serializer.data)
        else:
            return Response(
                {'message': 'You do not have permission to perform this action'},
                status=status.HTTP_401_UNAUTHORIZED
            )
