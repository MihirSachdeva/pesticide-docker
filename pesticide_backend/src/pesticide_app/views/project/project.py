import os
import threading
from datetime import datetime
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from pesticide_app.api.serializers import ProjectSerializer
from pesticide_app.permissions import ProjectCreatorMembersPermissions, AdminOrReadOnlyPermisions
from pesticide_app.models import Project, User, ProjectIcon
from pesticide_app.mailing import add_project_member, project_status_update, new_project_added
from slugify import slugify
from pesticide.settings import FRONTEND_URL


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
        post_data = request.POST
        name = post_data.get('name')
        if ((name is not None) & (len(name) != 0)):
            project_slug = slugify(name)
            slugs = []
            for p in Project.objects.all():
                slugs.append(slugify(p.name))
            if project_slug in slugs:
                return Response(
                    {"message": "Project name should be strictly unique."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            project_icon = request.FILES.get('image')
            wiki = post_data.get('wiki')
            project_status = post_data.get('status', 'Testing')
            link = post_data.get('link')
            project = Project.objects.create(
                name=name,
                wiki=wiki,
                status=project_status,
                link=link,
                timestamp=datetime.now(),
                creator=request.user,
            )
            members = post_data.get('members')
            if ((members is not None) & (len(members) != 0)):
                members_id_list = members.split(',')
                members_list = list(
                    User.objects.filter(id__in=members_id_list)
                )
                project.members.set(members_list)
            if project_icon is not None:
                ProjectIcon.objects.create(project=project, image=project_icon)

            projectPageLink = f"{FRONTEND_URL}/projects/{slugify(project.name)}"
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

            return Response(
                {"message": 'Project created.'},
                status=status.HTTP_201_CREATED
            )
        return Response('Name of project cannot be empty.', status=status.HTTP_400_BAD_REQUEST)

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
                projectPageLink = f"{FRONTEND_URL}/projects/{slugify(project.name)}"
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
                projectPageLink = f"{FRONTEND_URL}/projects/{slugify(project.name)}"
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
