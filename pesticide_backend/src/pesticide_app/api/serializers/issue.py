from rest_framework import serializers
from slugify import slugify
from pesticide_app.models import Issue, IssueImage, IssueStatus
from .comment import CommentSerializer


class IssueImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueImage
        fields = '__all__'


class IssueStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueStatus
        fields = '__all__'


class IssueStatusTallySerializer(serializers.ModelSerializer):
    number_of_issues = serializers.SerializerMethodField('numberOfIssues')

    def numberOfIssues(self, obj):
        return len(obj.issue_set.all())

    class Meta:
        model = IssueStatus
        fields = '__all__'


class IssueSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(
        source='comment_set', many=True, read_only=True)
    image = IssueImageSerializer(
        source='issueimage_set', many=True, read_only=True)
    reporter_details = serializers.SerializerMethodField('reporterDetails')
    assignee_details = serializers.SerializerMethodField('assigneeDetails')
    project_name = serializers.SerializerMethodField('projectName')
    status_text = serializers.SerializerMethodField('statusText')
    status_color = serializers.SerializerMethodField('statusColor')
    status_type = serializers.SerializerMethodField('statusType')
    project_details = serializers.SerializerMethodField('projectDetails')

    def projectDetails(self, obj):
        name = obj.project.name
        project_info = {
            'id': obj.project.id,
            'name': name,
            'slug': slugify(name),
            'icon': obj.project.project_icon.image.url
        }
        return project_info

    def reporterDetails(self, obj):
        details = {
            'id': obj.reporter.id,
            'name': obj.reporter.name,
            'enrollment_number': obj.reporter.enrollment_number,
            'display_picture': obj.reporter.display_picture
        }
        return details

    def projectName(self, obj):
        return obj.project.name

    def assigneeDetails(self, obj):
        if obj.assigned_to != None:
            details = {
                'id': obj.assigned_to.id,
                'name': obj.assigned_to.name,
                'enrollment_number': obj.assigned_to.enrollment_number,
                'display_picture': obj.assigned_to.display_picture
            }
        else:
            details = None
        return details

    def statusText(self, obj):
        status_text = ""
        if obj.status != None:
            status_text = obj.status.status_text
        else:
            status_text = 'New'

        return status_text

    def statusColor(self, obj):
        status_color = ""
        if obj.status != None:
            status_color = obj.status.color
        else:
            status_color = "#217bf3"

        return status_color

    def statusType(self, obj):
        status_type = ""
        if obj.status != None:
            status_type = obj.status.type
        else:
            status_type = 'Pending'

        return status_type

    class Meta:
        model = Issue
        fields = '__all__'


class IssueSearchSerializer(serializers.ModelSerializer):
    status_text = serializers.SerializerMethodField('statusText')
    status_color = serializers.SerializerMethodField('statusColor')
    status_type = serializers.SerializerMethodField('statusType')
    project_details = serializers.SerializerMethodField('projectDetails')

    def projectDetails(self, obj):
        name = obj.project.name
        project_info = {
            'id': obj.project.id,
            'name': name,
            'slug': slugify(name),
            'icon': obj.project.project_icon.image.url
        }
        return project_info

    def assigneeDetails(self, obj):
        if obj.assigned_to != None:
            details = {
                'id': obj.assigned_to.id,
                'name': obj.assigned_to.name,
                'enrollment_number': obj.assigned_to.enrollment_number,
                'display_picture': obj.assigned_to.display_picture
            }
        else:
            details = None
        return details

    def statusText(self, obj):
        status_text = ""
        if obj.status != None:
            status_text = obj.status.status_text
        else:
            status_text = 'New'

        return status_text

    def statusColor(self, obj):
        status_color = ""
        if obj.status != None:
            status_color = obj.status.color
        else:
            status_color = "#217bf3"

        return status_color

    def statusType(self, obj):
        status_type = ""
        if obj.status != None:
            status_type = obj.status.type
        else:
            status_type = 'Pending'

        return status_type

    class Meta:
        model = Issue
        fields = '__all__'
