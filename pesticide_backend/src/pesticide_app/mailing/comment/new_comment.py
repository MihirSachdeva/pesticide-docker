from django.core.mail import send_mail
from django.conf import settings
from ...mailing.mail_templates.new_comment import NewCommentTemplate
from pesticide.settings import FRONTEND_URL


def new_comment(project_name, project_page_link, issue_title, issue_reporter_name, comment, commentor_name, issue_reporter, issue_assignee, project_members=[]):
    """
    Send email to notify members of the project, reporter of the issue and issue assignee that a new comment
    has been added in the concerning issue. \n
    Takes args(project_name, project_page_link, issue_title, issue_reporter_name, comment, commentor_name, issue_reporter, issue_assignee, project_members=[])
    """

    for member in project_members:
        if member.email_subscriptions.on_new_comment:
            mail_template = NewCommentTemplate(
                project_name,
                project_page_link,
                issue_title,
                comment,
                commentor_name,
                person_name=member.name,
                app_link=FRONTEND_URL
            )

            name = member.name
            email = member.email

            text = f"""
                        Hi, {name}!
                        {commentor_name} just added a new comment in the issue:
                        {issue_title} (issue reported by {issue_reporter_name})

                        The comment says:
                        {comment}
                        In the project: {project_name}
                        
                        The Pesticide Mailer
                    """

            html = mail_template.for_project_member()

            send_mail(
                subject=f"[PESTICIDE] New Comment by {commentor_name} in issue '{issue_title}' ({project_name})",
                message=text,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email, ],
                html_message=html,
                fail_silently=False
            )

    if issue_reporter.email_subscriptions.on_new_comment:
        name = issue_reporter.name
        email = issue_reporter.email
        mail_template = NewCommentTemplate(
            project_name,
            project_page_link,
            issue_title,
            comment,
            commentor_name,
            person_name=name,
            app_link=FRONTEND_URL
        )

        text = f"""
                    Hi, {name}!
                    {commentor_name} just added a new comment in the issue:
                    {issue_title} (issue reported by {issue_reporter_name})

                    The comment says:
                    {comment}
                    In the project: {project_name}
                    
                    Pesticide
                """

        html = mail_template.for_issue_reporter()

        send_mail(
            subject=f"[PESTICIDE] New Comment by {commentor_name} in issue '{issue_title}' ({project_name})",
            message=text,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[issue_reporter.email, ],
            html_message=html,
            fail_silently=False
        )

    if (issue_assignee != None):
        if (issue_assignee.email_subscriptions.on_new_comment):
            name = issue_assignee.name
            email = issue_assignee.email

            mail_template = NewCommentTemplate(
                project_name,
                project_page_link,
                issue_title,
                comment,
                commentor_name,
                person_name=name,
                app_link=FRONTEND_URL
            )

            text = f"""
                        Hi, {name}!
                        {commentor_name} just added a new comment in the issue:
                        {issue_title} (issue reported by {issue_reporter_name})

                        The comment says:
                        {comment}
                        In the project: {project_name}
                        
                        Pesticide
                    """

            html = mail_template.for_issue_assignee()

            send_mail(
                subject=f"[PESTICIDE] New Comment by {commentor_name} in issue '{issue_title}' ({project_name})",
                message=text,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[issue_assignee.email, ],
                html_message=html,
                fail_silently=True
            )
