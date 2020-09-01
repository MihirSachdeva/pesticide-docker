from django.core.mail import send_mail
from django.conf import settings
from ..mail_templates.project_status import ProjectStatusUpdateTemplate

def project_status_update(project_name, project_link, project_page_link, old_status, new_status, changed_by_name, users=[]):
    """
    Send email to notify all users that a project's status has been changed. \n
    Takes args(project_name, project_link, project_page_link, old_status, new_status, users=[])
    """

    for member in users:
        if member.email_subscriptions.on_project_status_change:
            name = member.name
            email = member.email

            mail_template = ProjectStatusUpdateTemplate(
                project_name=project_name,
                project_page_link=project_page_link,
                old_project_status=old_status,
                project_status=new_status,
                status_updated_by=changed_by_name,
                person_name=name,
                app_link="http://127.0.0.1:3000"
            )

            text = f"""
                        Hi, {name}!
                        The status of {project_name} has been changed from {old_status} to {new_status} by {changed_by_name}!
                        
                        The Pesticide Mailer
                    """

            html = mail_template.for_all_users()

            send_mail(
                subject=f"[PESTICIDE] {project_name}'s status has been changed to {new_status}.",
                message=text,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email, ],
                html_message=html,
                fail_silently=False
            )
