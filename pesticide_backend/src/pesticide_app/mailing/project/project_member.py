from django.core.mail import send_mail
from django.conf import settings
from ..mail_templates.project_membership import ProjectMembershipTemplate


def add_project_member(project_name, project_link, project_page_link, member_added_by, project_members, project_status, new_members=[]):
    """
    Send email to notify users that they have been added as a member in a project. \n
    Takes args(project_name, project_link, project_page_link, member_added_by, project_members, project_status, new_members=[])
    """

    for member in new_members:
        if member.email_subscriptions.on_project_membership:
            name = member.name
            email = member.email

            mail_template = ProjectMembershipTemplate(
                project_name=project_name,
                project_page_link=project_page_link,
                member_added_by=member_added_by,
                project_members=project_members,
                project_status=project_status,
                person_name=name,
                app_link="http://127.0.0.1:3000"
            )

            text = f"""
                        Hi, {name}!
                        You have been added as a team member in the project {project_name}!
                        
                        The Pesticide Mailer
                    """

            html = mail_template.for_new_project_memebers()

            send_mail(
                subject=f"[PESTICIDE] Project Membership: {project_name}",
                message=text,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email, ],
                html_message=html,
            )
