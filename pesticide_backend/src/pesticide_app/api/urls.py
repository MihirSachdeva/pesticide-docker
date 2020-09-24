from django.urls import path
from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from pesticide_app.views import *

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'userByEnrNo', UserByEnrNoViewSet, basename='userByEnrNo')
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'issues', IssueViewSet, basename='issues')
router.register(r'issue_search', IssueSearchViewSet, basename='issue_search')
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'tags', TagViewSet, basename='tags')
router.register(r'projectnameslug', ProjectNameSlugViewSet, basename='project_names_and_slugs')
router.register(r'projecticons', ProjectIconViewSet, basename='project_icons')
router.register(r'issueimages', IssueImageViewSet, basename='issue_images')
router.register(r'issuestatus', IssueStatusViewSet, basename='issue_status')
router.register(r'issuestatustally', IssueStatusTallyViewSet, basename='issue_status_tally')
router.register(r'userissues', UsersIssueTallyViewSet, basename='user_issues')
router.register(r'current_user', UserIdViewSet, basename='current_user')
router.register(r'user_logged_in', UserLoggedInViewSet, basename='user_logged_in')
router.register(r'project_members', ProjectMembers, basename='project_members')
router.register(r'project_issue_status', ProjectIssueStatusViewSet, basename='project_issue_status_tally')
router.register(r'email_subscriptions', EmailSubscriptionViewset, basename='email_subscriptions')
router.register(r'user_status', UserStatusViewset, basename='user_status')
urlpatterns = router.urls

urlpatterns += [
    url(r'topdebuggers', TopDebuggersView.as_view()),
    url(r'tag_colors', TagColorsView.as_view()),
    url(r'issue_status_colors', IssueStatusColorsView.as_view()),
    url(r'search', SearchView.as_view()),
]