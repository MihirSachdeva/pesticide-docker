from django.db import models
from pesticide_app.models.user import User
from pesticide_app.models.issue import Issue
from datetime import datetime

class Comment(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)
    commentor = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField() 
    timestamp = models.DateTimeField(default=datetime.now, blank=True, null=True)

    def __str__(self):
        return self.text

    def get_latest_comments():
        return Comment.objects.order_by('-timestamp').all()[:5]

    class Meta:
        ordering = ['timestamp']
    