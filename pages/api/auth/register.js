// pages/api/auth/register.js
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/utils/emailService';

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await dbConnect();

  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = generateVerificationCode();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      verificationCode,
      verificationCodeExpires: Date.now() + 3600000, // Code expires in 1 hour
    });

    await newUser.save();

    // Send verification email with code
    await sendVerificationEmail(email, verificationCode);

    console.log('User registered:', { email, verificationCode });

    res.status(201).json({ 
      message: 'User registered successfully. Please check your email for the verification code.',
      email: email // Send email back to client for verification step
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}