from django.db import models
from datetime import datetime

from pesticide_app.models.user import User
from pesticide_app.models.emoticon import Emoticon
from pesticide_app.models.comment import Comment


class Reactor(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comment_reacts')
    emoticon = models.ForeignKey(Emoticon, on_delete=models.CASCADE, related_name='emoticon_reaction')
    timestamp = models.DateTimeField(default=datetime.now)

    class Meta:
        unique_together = ['user', 'emoticon', 'comment']
        ordering = ['emoticon', 'comment', '-timestamp']

    def __str__(self):
        return f'{self.user.name} reacted with :{self.emoticon.emoji}: on comment {self.comment.id}'
