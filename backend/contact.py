import re
import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SMTP_HOST      = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT      = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER      = os.getenv("SMTP_USER", "")
SMTP_PASSWORD  = os.getenv("SMTP_PASSWORD", "")
_raw_receivers = os.getenv("RECEIVER_EMAIL", "")
RECEIVER_EMAILS = [e.strip() for e in _raw_receivers.split(",") if e.strip()]


class ContactForm(BaseModel):
    name: str
    phone: str
    email: str
    message: str


def send_email(form: ContactForm):
    msg = MIMEMultipart("alternative")
    msg["Subject"]  = f"New Contact Form: {form.name}"
    msg["From"]     = SMTP_USER
    msg["To"]       = ", ".join(RECEIVER_EMAILS)
    msg["Reply-To"] = form.email

    received_at = datetime.now(timezone.utc).strftime("%d %b %Y, %I:%M %p UTC")

    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #dde3f0;border-radius:10px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#1a3c8f,#2d6cdf);padding:24px 32px;">
        <h2 style="color:white;margin:0;font-size:20px;">New Contact Form Submission</h2>
        <p style="color:#c8d8ff;margin:4px 0 0;font-size:13px;">KD College Website</p>
      </div>
      <div style="padding:28px 32px;background:#f9fbff;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;font-weight:700;color:#1a3c8f;width:120px;">Name</td>
            <td style="padding:10px 0;color:#333;">{form.name}</td>
          </tr>
          <tr style="border-top:1px solid #eee;">
            <td style="padding:10px 0;font-weight:700;color:#1a3c8f;">Phone</td>
            <td style="padding:10px 0;color:#333;">{form.phone}</td>
          </tr>
          <tr style="border-top:1px solid #eee;">
            <td style="padding:10px 0;font-weight:700;color:#1a3c8f;">Email</td>
            <td style="padding:10px 0;color:#333;"><a href="mailto:{form.email}" style="color:#2d6cdf;">{form.email}</a></td>
          </tr>
          <tr style="border-top:1px solid #eee;">
            <td style="padding:10px 0;font-weight:700;color:#1a3c8f;vertical-align:top;">Message</td>
            <td style="padding:10px 0;color:#333;white-space:pre-wrap;">{form.message}</td>
          </tr>
          <tr style="border-top:1px solid #eee;">
            <td style="padding:10px 0;font-weight:700;color:#1a3c8f;">Received At</td>
            <td style="padding:10px 0;color:#888;font-size:13px;">{received_at}</td>
          </tr>
        </table>
      </div>
    </div>
    """

    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, RECEIVER_EMAILS, msg.as_string())


@router.post("/contact")
def submit_contact(form: ContactForm):
    if not form.name.strip():
        return {"success": False, "error": "Name is required."}

    if not re.fullmatch(r"\d{10}", form.phone.strip()):
        return {"success": False, "error": "Valid 10-digit phone number is required."}

    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", form.email.strip()):
        return {"success": False, "error": "Valid email address is required."}

    if not form.message.strip():
        return {"success": False, "error": "Message is required."}

    try:
        send_email(form)
    except Exception as e:
        print("Email send failed:", e)
        return {"success": False, "error": "Failed to send email. Please try again."}

    return {"success": True, "message": "Message received! We will contact you soon."}
