import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, message) => {
  try {
    console.log('📧 Setting up email transporter...');
    console.log('📧 SMTP Config:', {
      host: "smtp-relay.brevo.com",
      port: 587,
      user: process.env.SMTP_USER,
      sender: process.env.SMTP_SENDER
    });

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log(`📧 Sending email to: ${to} with subject: ${subject}`);
    const info = await transporter.sendMail({
      from: `"Yoga Planner" <${process.env.SMTP_SENDER}>`,
      to,
      subject,
      text: message,
      html: message.replace(/\n/g, '<br>')
    });

    console.log("✅ Email sent successfully to:", to);
    console.log("📧 Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email to:", to);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error code:", error.code);
    console.error("❌ Full error:", error);
    throw error;
  }
};

// Send verification email
export const sendVerificationEmail = async (email, name, verificationUrl) => {
  const subject = "🧘 Verify Your Email - Yoga Planner App";
  const message = `Hi ${name},\n\nThank you for registering with Yoga Planner App!\n\nPlease verify your email by clicking the link below:\n${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create this account, please ignore this email.\n\n- Yoga Planner App Team`;
  
  await sendEmail(email, subject, message);
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const subject = "🔒 Password Reset Request - Yoga Planner App";
  const message = `Hi ${name},\n\nYou requested to reset your password.\n\nPlease click the link below to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email and your password will remain unchanged.\n\n- Yoga Planner App Team`;
  
  await sendEmail(email, subject, message);
};
