import twilio from "twilio";

export const sendSMS = async (to, body) => {
  try {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE, // Twilio number (like +16812636913)
      to, // recipient’s number (must be verified on trial)
    });

    // console.log("✅ SMS sent successfully to:", to, "| SID:", message.sid);
  } catch (error) {
    // console.error("❌ SMS sending error:", error.message);
  }
};
