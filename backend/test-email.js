import dotenv from 'dotenv';
import { sendEmail } from './utils/sendEmail.js';

dotenv.config();

console.log('🧪 Testing email configuration...');
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_SENDER:', process.env.SMTP_SENDER);

// Test sending an email
const testEmail = async () => {
  try {
    console.log('\n📧 Sending test email...');
    await sendEmail(
      process.env.SMTP_SENDER, // Send to yourself
      '🧪 Test Email - Yoga Planner',
      'This is a test email from Yoga Planner App.\n\nIf you receive this, the email configuration is working correctly!'
    );
    console.log('✅ Test email sent successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test email failed:', error);
    process.exit(1);
  }
};

testEmail();
