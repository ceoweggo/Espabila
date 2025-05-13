import os
from typing import List, Optional
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Content, Email, To
from dotenv import load_dotenv
import logging
from pathlib import Path
import jinja2

# Load environment variables
load_dotenv()

# Logger
logger = logging.getLogger(__name__)

# SendGrid configuration
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@espabila.com")
FROM_NAME = os.getenv("FROM_NAME", "EspaBila")

# Template loader
template_loader = jinja2.FileSystemLoader(searchpath=Path(__file__).parent.parent / "templates")
template_env = jinja2.Environment(loader=template_loader)


async def send_email(
    to_emails: List[str],
    subject: str,
    html_content: str,
    from_email: Optional[str] = None,
    from_name: Optional[str] = None
) -> bool:
    """
    Send an email using SendGrid
    
    Args:
        to_emails: List of recipient email addresses
        subject: Email subject
        html_content: HTML content of the email
        from_email: Sender email address (defaults to configured FROM_EMAIL)
        from_name: Sender name (defaults to configured FROM_NAME)
        
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    if not SENDGRID_API_KEY:
        logger.warning("SendGrid API key not configured, email not sent")
        return False
    
    # Use default sender if not provided
    from_email = from_email or FROM_EMAIL
    from_name = from_name or FROM_NAME
    
    # Prepare email
    message = Mail(
        from_email=Email(from_email, from_name),
        to_emails=[To(email) for email in to_emails],
        subject=subject,
        html_content=Content("text/html", html_content)
    )
    
    try:
        # Send email
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
        # Log response
        logger.info(f"Email sent with status code: {response.status_code}")
        return response.status_code >= 200 and response.status_code < 300
    
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        return False


async def send_welcome_email(user_email: str, user_name: str) -> bool:
    """
    Send a welcome email to a new user
    
    Args:
        user_email: User's email address
        user_name: User's name
        
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        # Load email template
        template = template_env.get_template("welcome_email.html")
        
        # Render template with user data
        html_content = template.render(
            user_name=user_name,
            app_name="EspaBila",
            login_url=os.getenv("FRONTEND_URL", "https://espabila.com") + "/login"
        )
        
        # Send email
        return await send_email(
            to_emails=[user_email],
            subject="¡Bienvenido a EspaBila!",
            html_content=html_content
        )
    
    except Exception as e:
        logger.error(f"Error sending welcome email: {e}")
        return False


async def send_password_reset_email(user_email: str, user_name: str, reset_token: str) -> bool:
    """
    Send a password reset email to a user
    
    Args:
        user_email: User's email address
        user_name: User's name
        reset_token: Password reset token
        
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        # Load email template
        template = template_env.get_template("password_reset_email.html")
        
        # Create reset URL
        reset_url = f"{os.getenv('FRONTEND_URL', 'https://espabila.com')}/reset-password?token={reset_token}"
        
        # Render template with user data
        html_content = template.render(
            user_name=user_name,
            app_name="EspaBila",
            reset_url=reset_url,
            valid_hours=24  # Token validity in hours
        )
        
        # Send email
        return await send_email(
            to_emails=[user_email],
            subject="Restablecimiento de contraseña - EspaBila",
            html_content=html_content
        )
    
    except Exception as e:
        logger.error(f"Error sending password reset email: {e}")
        return False 