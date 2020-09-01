from django.db import models
from djrichtextfield.models import RichTextField
from pesticide_app.models.user import User
from pesticide_app.models.project import Project
from pesticide_app.models.tag import Tag
from pesticide_app.models.issue_status import IssueStatus

def upload_path(instance, filename):
    return '/'.join(['issue_images', filename])

class Issue(models.Model):
    title = models.CharField(max_length=50)
    description = RichTextField(blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='issue_creator')
    tags = models.ManyToManyField(Tag, blank=True)
    status = models.ForeignKey(IssueStatus, blank=True, null=True, on_delete=models.SET_NULL)
    assigned_to = models.ForeignKey(User, blank=True, null=True, related_name='issue_asignee', on_delete=models.SET_NULL)
    timestamp = models.DateTimeField()

    def __str__(self):
        return "%s - %s" % (self.title, self.project)
    
    def get_latest_issues():
        return Issue.objects.order_by('-timestamp').all()[:5]

    class Meta:
        ordering = ['-timestamp']