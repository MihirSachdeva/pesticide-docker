from rest_framework import serializers
from pesticide_app.models import Comment

class CommentSerializer(serializers.ModelSerializer):
    commentor_details = serializers.SerializerMethodField('commentorDetails')

    def commentorDetails(self, obj):
        details = {
            'id': obj.commentor.id,
            'name': obj.commentor.name,
            'enrollment_number': obj.commentor.enrollment_number,
            'display_picture': obj.commentor.display_picture
        }
        return details

    class Meta:
        model = Comment
        fields = '__all__'
