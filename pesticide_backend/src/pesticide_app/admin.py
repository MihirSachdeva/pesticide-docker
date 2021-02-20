from django.contrib import admin

from pesticide_app.models import (
    User, 
    Project, 
    Issue, 
    Comment, 
    Tag, 
    IssueImage, 
    ProjectIcon,
    IssueStatus,
    EmailSubscription,
    Reactor,
    Emoticon,
)

admin.site.register(User)
admin.site.register(Project)
admin.site.register(ProjectIcon)
admin.site.register(Issue)
admin.site.register(Comment)
admin.site.register(Tag)
admin.site.register(IssueImage)
admin.site.register(IssueStatus)
admin.site.register(EmailSubscription)
admin.site.register(Reactor)
admin.site.register(Emoticon)
