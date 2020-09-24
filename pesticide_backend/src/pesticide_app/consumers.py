import json
import threading
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model
from slugify import slugify

from pesticide_app.models import Comment, User, Issue
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
        commentor = User.objects.filter(id=data['commentor'])[0]
        issue = Issue.objects.filter(id=data['issue'])[0]
        comment = Comment.objects.create(
            commentor=commentor,
            issue=issue,
            text=data['text'],
        )

        projectPageLink = f"{FRONTEND_URL}/projects/{slugify(comment.issue.project.name)}/{comment.issue.id}"
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
        comment = Comment.objects.filter(id=data['comment_id']).delete()
        content = {
            'command': 'delete_comment',
            'comment_id': data['comment_id']
        }
        return self.send_chat_comment(content)

    def comments_to_json(self, comments):
        result = []
        for comment in comments:
            result.append(self.comment_to_json(comment))
        return result

    def comment_to_json(self, comment):
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
            }
        }

    commands = {
        'fetch_comments': fetch_comments,
        'new_comment': new_comment,
        'delete_comment': delete_comment
    }

    def connect(self):
        # self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_name = self.scope['url_route']['kwargs']['issue_id']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

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
