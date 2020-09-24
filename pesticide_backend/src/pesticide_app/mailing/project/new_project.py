from django.core.mail import send_mail
from django.conf import settings
from ..mail_templates.new_project import NewProjectTemplate
from pesticide.settings import FRONTEND_URL

def new_project_added(project_name, project_link, project_page_link, project_creator, project_members, project_status, users=[]):
    """
    Send email to notify all users (members of IMG) that a new project has been added in Pesticide. \n
    Takes args(project_name, project_link, project_page_link, project_creator, project_members, project_status, users=[])
    """

    for member in users:
        if member.email_subscriptions.on_new_project:
            name = member.name
            email = member.email

            mail_template = NewProjectTemplate(
                project_name,
                project_page_link,
                project_creator,
                project_members,
                project_status,
                person_name=name,
                app_link=FRONTEND_URL
            )

            text = f"""
                        Hi, {name}!
                        A new project, {project_name} has been added to The Pesticide App by {project_creator}.

                        The Pesticide Mailer
                    """

            html = mail_template.for_all_users()

            send_mail(
                subject=f"[PESTICIDE] New Project: {project_name}",
                message=text,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email, ],
                html_message=html,
                fail_silently=True
            )
