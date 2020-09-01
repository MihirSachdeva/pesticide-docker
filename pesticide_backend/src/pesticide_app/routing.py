from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/issue_comments/(?P<issue_id>[^/]+)/$', consumers.CommentsConsumer),
]