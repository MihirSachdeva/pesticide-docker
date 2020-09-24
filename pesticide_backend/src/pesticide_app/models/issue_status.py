from django.db import models


class IssueStatus(models.Model):
    class IssueStatusType(models.TextChoices):
        PENDING = 'Pending', "Pending"
        CLOSED = 'Closed', "Closed"
        RESOLVED = 'Resolved', "Resolved"

    status_text = models.CharField(max_length=30, unique=True)
    color = models.CharField(max_length=10, default="#217bf3")
    type = models.CharField(max_length=30, choices=IssueStatusType.choices,
                            default=IssueStatusType.PENDING)

    def __str__(self):
        return self.status_text
