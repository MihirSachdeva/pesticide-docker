from django.db import models
from datetime import datetime
from djrichtextfield.models import RichTextField

from pesticide_app.models.user import User
from pesticide_app.models.issue import Issue


class Comment(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)
    commentor = models.ForeignKey(User, on_delete=models.CASCADE)
    text = RichTextField(blank=False)
    timestamp = models.DateTimeField(default=datetime.now, blank=True, null=True)

    def __str__(self):
        return f"{self.commentor.name}'s comment on issue '{self.issue.title}' - {self.issue.project.name}"

    def get_latest_comments():
        return Comment.objects.order_by('-timestamp').all()[:5]

    class Meta:
        ordering = ['timestamp']
