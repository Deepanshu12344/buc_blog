import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (request, response) => {
  try {
    const { fullname, email, password } = request.body;

    if (!fullname || !email || !password) {
      return response.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    response.status(201).json(userResponse);
  } catch (error) {
    console.error('Registration error:', error);
    response.status(500).json({ message: "Server error" });
  }
};

export const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return response.status(401).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    response.status(200).json({ token, user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    response.status(500).json({ message: "Server error" });
  }
};

export const googleAuthCallback = async (request, response) => {
  try {
    const user = request.user;
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Redirect to frontend with token
    response.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Google auth error:', error);
    response.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};