// pages/api/auth/resend-code.js
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/user';
import { sendVerificationEmail } from '../../../utils/emailService';

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await dbConnect();

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    const newVerificationCode = generateVerificationCode();
    user.verificationCode = newVerificationCode;
    user.verificationCodeExpires = Date.now() + 3600000; // Code expires in 1 hour
    await user.save();

    await sendVerificationEmail(email, newVerificationCode);

    res.status(200).json({ message: 'New verification code sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}