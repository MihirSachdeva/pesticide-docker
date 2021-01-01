from django.db import models

from pesticide_app.models.user import User
from pesticide_app.models.emoticon import Emoticon


class Reactor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comment_reactor')
    emoticon = models.ForeignKey(Emoticon, on_delete=models.CASCADE, related_name='comment_emoji')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'emoticon']

    def __str__(self):
        return f'{self.user.name} reacted with {emoticon.emoji}'
