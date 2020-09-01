from django.core.mail import send_mail
from django.conf import settings
from ..mail_templates.issue_status import IssueStatusUpdateTemplate

def issue_status_update(project_name, project_page_link, issue_title, old_status, new_status, status_updated_by, reporter, project_members=[]):
    """
    Send email to notify members of a project and reporter of an issue that the status of the concerning 
    issue has been changed. \n
    Takes args(project_name, project_page_link, issue_title, old_status, new_status, status_updated_by, reporter, project_members=[])
    """

    for member in project_members:
        if member.email_subscriptions.on_issue_status_change:

            name = member.name
            email = member.email

            mail_template = IssueStatusUpdateTemplate(
                project_name, 
                project_page_link, 
                issue_title, 
                old_status, 
                new_status, 
                status_updated_by, 
                person_name=name,
                app_link = "http://127.0.0.1:3000"
            )

            text = f"""
                        Hi, {name}!
                        The following issue in the project {project_name} has been changed from {old_status.status_text} to {new_status.status_text} by {status_updated_by.name}:
                        {issue_title}
                        
                        The Pesticide Mailer
                    """

            html = mail_template.for_project_member()

            send_mail(
                subject=f"[PESTICIDE] Issue Status Change in {project_name}",
                message=text,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email, ],
                html_message=html,
                fail_silently=False
            )

    if reporter.email_subscriptions.on_issue_status_change:
        name = reporter.name
        email = reporter.email

        mail_template = IssueStatusUpdateTemplate(
            project_name, 
            project_page_link, 
            issue_title, 
            old_status, 
            new_status, 
            status_updated_by, 
            person_name=name,
            app_link = "http://127.0.0.1:3000"
        )

        text = f"""
                    Hi, {name}!
                    The following issue you reported in the project {project_name} has been changed from {old_status.status_text} to {new_status.status_text} by {status_updated_by.name}:
                    {issue_title}
                    
                    Pesticide
                """

        html = mail_template.for_issue_reporter()

        # html = f"""
        #             <html>
        #                 <head></head>
        #                 <body style="max-width:350px;">
        #                         <h3>Hi, {name}!</h3>
        #                         <div>
        #                             The following issue you reported in the project <b>{project_name}</b> has been changed from 
        #                             <b style="color: {old_status.color};">{old_status.status_text}</b> to <b style="color: {new_status.color};">{new_status.status_text}</b> 
        #                             by {status_updated_by.name}:
        #                         <div>
        #                         <br>
                                
        #                         <b>{issue_title}</b>
        #                         <br>
        #                         <center>
        #                             <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
        #                                 <center>
        #                                     <div style="display:table-cell; vertical-align:middle;"> 
        #                                         <a style="color:white; font-size:16px;" href="{project_page_link}">Go to Project</a>
        #                                     </div>
        #                                 </center>
        #                             </div>
        #                         </center>
        #                         <br>
        #                         <br>
        #                         Pesticide<br>
        #                 </body>
        #             </html>
        #         """

        send_mail(
            subject=f"[PESTICIDE] Status change on an issue you reported in {project_name}",
            message=text,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email, ],
            html_message=html,
            fail_silently=False
        )
