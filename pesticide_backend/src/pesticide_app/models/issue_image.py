from django.db import models
from pesticide_app.models.issue import Issue

def upload_path(instance, filename):
    return '/'.join(['issue_images', filename])

class IssueImage(models.Model):
    image = models.ImageField(blank=True, null=True, upload_to=upload_path)
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)

    def __str__(self):
        return "Image - Issue: %s" % (self.issue)