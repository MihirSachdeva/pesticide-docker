from django.core.mail import send_mail
from django.conf import settings
from ..mail_templates.issue_assigned import IssueAssignTemplate
from pesticide.settings import FRONTEND_URL


def issue_assigned(project_name, project_page_link, issue_title, issue_tags, assigned_to, assigned_by):
    """
    Send email to notify user that an issue has been assigned to them. \n
    Takes args(project_name, project_page_link, issue_title, assigned_to, assigned_by)
    """
    if assigned_to.email_subscriptions.on_issue_assign:

        mail_template = IssueAssignTemplate(
            project_name,
            project_page_link,
            issue_title,
            issue_tags,
            assigned_by,
            person_name=assigned_to.name,
            app_link=FRONTEND_URL
        )

        text = f"""
                    Hi, {assigned_to.name}!
                    You have been assigned an issue in the project {project_name} by {assigned_by.name}.
                    The title of the issue is:
                    '{issue_title}''
                    
                    The Pesticide Mailer
                """

        html = mail_template.for_issue_assignee()

        send_mail(
            subject=f"[PESTICIDE] New issue assigned to you in {project_name}",
            message=text,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[assigned_to.email, ],
            html_message=html,
            fail_silently=True
        )
