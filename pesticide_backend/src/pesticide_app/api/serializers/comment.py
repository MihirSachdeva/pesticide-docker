from rest_framework import serializers
from pesticide_app.models import Comment


class CommentSerializer(serializers.ModelSerializer):
    commentor_details = serializers.SerializerMethodField('commentorDetails')
    issue_details = serializers.SerializerMethodField('issueDetails')
    reactions = serializers.SerializerMethodField('commentReactions')

    def commentorDetails(self, obj):
        details = {
            'id': obj.commentor.id,
            'name': obj.commentor.name,
            'enrollment_number': obj.commentor.enrollment_number,
            'display_picture': obj.commentor.display_picture
        }
        return details

    def issueDetails(self, obj):
        details = {
            'id': obj.issue.id,
            'title': obj.issue.title,
            'project_id': obj.issue.project.id,
            'project_name': obj.issue.project.name,
        }
        return details

    def commentReactions(self, obj):
        comment_reactions = []
        reaction_types = []
        for comment_reaction in obj.reactions.all():
            reaction_types.append(comment_reaction.emoticon.emoji)
        reaction_types = set(reaction_types)
        for reaction_type in reaction_types:
            reaction_data = {}
            reaction_data['emoticon'] = reaction_type
            reaction_type_reactors = []
            for reaction in obj.reactions.filter(emoticon__emoji=reaction_type):
                reaction_type_reactors.append({
                    'id': reaction.user.id,
                    'name': reaction.user.name,
                    'enrollment_number': reaction.user.enrollment_number,
                    'display_picture': reaction.user.display_picture
                })
            reaction_data['reacters'] = reaction_type_reactors
            reaction_data['count'] = len(reaction_type_reactors)
            comment_reactions.append(reaction_data)

        return comment_reactions

    class Meta:
        model = Comment
        fields = '__all__'
