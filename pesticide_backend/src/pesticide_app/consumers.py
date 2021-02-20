import json
import threading
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model
from slugify import slugify

from pesticide_app.models import Comment, User, Issue, Reactor, Emoticon
from pesticide_app.mailing import new_comment
from pesticide.settings import FRONTEND_URL


class CommentsConsumer(WebsocketConsumer):

    def fetch_comments(self, data):
        comments = Comment.objects.filter(issue=data['issue'])
        content = {
            'command': 'comments',
            'comments': self.comments_to_json(comments)
        }
        self.send_comments(content)

    def new_comment(self, data):
        commentor = self.scope["user"]
        issue = Issue.objects.filter(id=data['issue'])[0]
        comment = Comment.objects.create(
            commentor=commentor,
            issue=issue,
            text=data['text'],
        )

        projectPageLink = f"{FRONTEND_URL}/projects/{slugify(comment.issue.project.name)}/issue/{comment.issue.id}"
        email_notification = threading.Thread(
            target=new_comment,
            args=(
                comment.issue.project.name,
                projectPageLink,
                comment.issue.title,
                comment.issue.reporter.name,
                comment,
                comment.commentor.name,
                comment.issue.reporter,
                comment.issue.assigned_to,
                comment.issue.project.members.all(),
            )
        )
        email_notification.start()

        content = {
            'command': 'new_comment',
            'comment': self.comment_to_json(comment)
        }
        return self.send_chat_comment(content)

    def delete_comment(self, data):
        comment = Comment.objects.get(id=data['comment_id']).delete()
        content = {
            'command': 'delete_comment',
            'comment_id': data['comment_id']
        }
        return self.send_chat_comment(content)

    def new_reaction(self, data):
        user = self.scope["user"]
        comment = Comment.objects.get(id=data['comment'])
        emoticon = Emoticon.objects.get(aria_label=data['aria_label'])

        reaction = Reactor.objects.create(
            comment=comment,
            user=user,
            emoticon=emoticon,
        )

        content = {
            'command': 'new_reaction',
            'comment': comment.id,
            'reaction': {
                'id': reaction.id,
                'emoticon': emoticon.emoji,
                'aria_label': emoticon.aria_label,
                'reacter': {
                    'id': user.id,
                    'name': user.name
                }
            }
        }

        return self.send_chat_comment(content)

    def delete_reaction(self, data):
        user = self.scope["user"]
        comment = Comment.objects.get(id=data['comment'])
        reaction = Reactor.objects.get(
            emoticon__aria_label=data['aria_label'],
            user=user,
            comment=comment
        )
        comment = reaction.comment

        content = {
            'command': 'delete_reaction',
            'comment': comment.id,
            'reaction': {
                'id': reaction.id,
                'emoticon': reaction.emoticon.aria_label,
                'reacter': {
                    'id': reaction.user.id,
                    'name': reaction.user.name
                }
            }
        }

        reaction.delete()

        return self.send_chat_comment(content)

    def comments_to_json(self, comments):
        result = []
        for comment in comments:
            result.append(self.comment_to_json(comment))
        return result

    def comment_to_json(self, comment):
        reactions = []
        reaction_types = []

        # Get all unique reaction types.
        for comment_reaction in comment.reactions.all():
            reaction_types.append(comment_reaction.emoticon.emoji)
        reaction_types = set(reaction_types)

        # For each reaction type, get the list of all reactions of that type.
        for reaction_type in reaction_types:
            reaction_data = {}
            reaction_data['emoticon'] = reaction_type
            reaction_data['aria_label'] = reaction_type
            reaction_type_reactors = []

            # Get all reactions of a specific reaction type.
            for reaction in comment.reactions.filter(emoticon__emoji=reaction_type):
                reaction_type_reactors.append({
                    'id': reaction.user.id,
                    'name': reaction.user.name
                })

            reaction_data['reacters'] = reaction_type_reactors
            reaction_data['count'] = len(reaction_type_reactors)

            # Finally append all reactions grouped by their reaction type in 'reactions' list.
            reactions.append(reaction_data)

        return {
            'id': comment.id,
            'commentor': comment.commentor.username,
            'text': comment.text,
            'timestamp': str(comment.timestamp),
            'commentor_details': {
                'id': comment.commentor.id,
                'name': comment.commentor.name,
                'enrollment_number': comment.commentor.enrollment_number,
                'display_picture': comment.commentor.display_picture
            },
            'reactions': reactions
        }

    commands = {
        'fetch_comments': fetch_comments,
        'new_comment': new_comment,
        'delete_comment': delete_comment,
        'new_reaction': new_reaction,
        'delete_reaction': delete_reaction,
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['issue_id']
        self.room_group_name = 'chat_%s' % self.room_name
        user = self.scope["user"]
        print(user)

        if user in User.objects.all():
            # Join room group
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
            self.accept()
        else:
            self.close()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_chat_comment(self, comment):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': comment
            }
        )

    def send_comments(self, message):
        self.send(text_data=json.dumps(message))

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps(message))
