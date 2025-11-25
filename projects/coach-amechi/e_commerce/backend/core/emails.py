from django.core.mail import send_mail
from django.conf import settings

html_message = '''
<html>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  }
  h1 {
    color: #333;
    text-align: center;
  }
</style>
  <body>
    <h1>Welcome to Our Platform!</h1>
    <p>Thank you for registering with us. We're excited to have you on board!</p>
  </body>
</html>
'''

def send_welcome_email(to_email: str):
    subject = "Welcome to Our Platform!"
    message = "Thank you for registering with us. We're excited to have you on board!"
    from_email = settings.DEFAULT_FROM_EMAIL

    send_mail(
        subject=subject,
        message=message,
        from_email=from_email,
        recipient_list=[to_email],
        fail_silently=False,
        html_message=html_message
        )