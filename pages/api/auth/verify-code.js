// pages/api/auth/verify-code.js
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/user';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await dbConnect();

  const { email, code } = req.body;

  console.log('Received verification request:', { email, code });

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    if (user.verificationCode !== code) {
      console.log('Verification code mismatch:', { expected: user.verificationCode, received: code });
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (user.verificationCodeExpires < Date.now()) {
      console.log('Verification code expired');
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    console.log('User verified successfully');
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error in verify-code API:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}