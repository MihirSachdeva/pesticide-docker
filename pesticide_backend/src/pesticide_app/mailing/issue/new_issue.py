from django.core.mail import send_mail
from django.conf import settings
from ..mail_templates.new_issue import NewIssueTemplate


def new_issue_reported(project_name, project_page_link, reported_by, issue_title, issue_tags, project_members=[]):
    """
    Send email to notify members of a project that a new issue has been reported in their project. \n
    Takes args(project_name, project_page_link, reported_by, issue_title, tags, project_members=[])
    """

    for member in project_members:
        if member.email_subscriptions.on_new_issue:
            name = member.name
            email = member.email

            mail_template = NewIssueTemplate(
                project_name=project_name,
                project_page_link=project_page_link,
                reported_by=reported_by,
                issue_title=issue_title,
                issue_tags=issue_tags,
                person_name=name,
                app_link='http://127.0.0.1:3000'
            )

            text = f"""
                        Hi, {name}!
                        {reported_by} has reported a new issue in your project {project_name}:

                        '{issue_title}'
                        
                        The Pesticide Mailer
                    """

            html = mail_template.for_project_member()

            send_mail(
                subject=f"[PESTICIDE] New Issue in {project_name}",
                message=text,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email, ],
                html_message=html,
                fail_silently=False
            )
