from rest_framework import serializers
from pesticide_app.models import Reactor


class ReactorSerializer(serializers.ModelSerializer):
    reacter_details = serializers.SerializerMethodField('reacterDetails')
    comment_details = serializers.SerializerMethodField('commentDetails')

    def reacterDetails(self, obj):
        details = {
            'id': obj.user.id,
            'name': obj.user.name,
            'enrollment_number': obj.user.enrollment_number,
        }
        return details

    def commentDetails(self, obj):
        details = {
            'id': obj.comment.id,
            'issue_id': obj.comment.issue.id,
            'project_id': obj.comment.issue.project.id,
            'project_name': obj.comment.issue.project.name,
        }
        return details

    class Meta:
        model = Reactor
        fields = '__all__'
