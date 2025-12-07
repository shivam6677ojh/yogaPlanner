import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Yoga Planner" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
      html: message.replace(/\n/g, '<br>')
    });

    // console.log("✅ Email sent successfully to:", to);
  } catch (error) {
    // console.error("❌ Error sending email:", error.message);
    throw new Error("Failed to send email");
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
