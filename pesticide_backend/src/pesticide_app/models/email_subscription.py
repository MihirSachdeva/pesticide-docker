from django.db import models
from .user import User


class EmailSubscription(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='email_subscriptions', primary_key=True)
    on_new_project = models.BooleanField(default=True) # sent to all users
    on_project_membership = models.BooleanField(default=True) # sent to project members (when added to a project as member)
    on_project_status_change = models.BooleanField(default=True) # sent to all users
    on_new_issue = models.BooleanField(default=True) # sent to project members
    on_issue_assign = models.BooleanField(default=True) # sent to project members and issue assignee
    on_issue_status_change = models.BooleanField(default=True) # sent to project members and issue reporter
    on_new_comment = models.BooleanField(default=True) # sent to project members and issue reporter

    def __str__(self):
        return "%s's Email Subscriptions" % (self.user.name)
