import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { tokenCookieOptions, TOKEN_EXPIRY } from "../middleware/middleware.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import "dotenv/config";

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    res.cookie("token", token, tokenCookieOptions);
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

export const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // check if emailis valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
    
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();

      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
        expiresIn: TOKEN_EXPIRY,
      });
      res.cookie("token", token, tokenCookieOptions);

      res.status(201).json({
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        profilePicture: savedUser.profilePicture,
      });

      try {
        await sendWelcomeEmail(savedUser.email, savedUser.username, process.env.CLIENT_URL);
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", tokenCookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
};

export default { signIn, signUp, logout };
