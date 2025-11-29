const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// 📌 **Nodemailer Transporter**
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📌 **1. User Registration**
router.post("/register", async (req, res) => {
  try {
    console.log('>>> register route hit');
    console.log('req.body', req.body);
    const { email, password, role, username } = req.body;

    console.log('Before checking mongoose connection...');
    console.log('mongoose readyState =>', require('mongoose').connection.readyState);
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

    console.log('Before User.findOne');
    const existingUser = await User.findOne({ email });
    console.log('After User.findOne', existingUser);

    
    if (existingUser) {
      console.log("Checking user exists...");
      console.log("email => ", email);
      console.log("existingUser => ", existingUser);
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash password before saving
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    const userStatus = role === "Admin" || role === "User";

    console.log('hashedPassword', hashedPassword);
    console.log('userStatus', userStatus);

    // Create new user
    const newUser = new User({
      username,
      role,
      email,
      password: hashedPassword,
      isVerified: userStatus,
    });

    console.log('newUser', newUser);

    await newUser.save();

    // Send Welcome Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Platform",
      html: `<p>Hello ${username},</p>
               <p>Your account has been successfully created. Please login using your credentials.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ message: "User registered successfully! Email sent." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 **2. User Login**
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request received:", req.body);

    // 🔍 Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: "User not found!" });
    }

    // 🔐 Check verification
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Your account is not verified. Contact Admin.",
      });
    }

    // 🔑 Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for:", email);
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // 🧍 User Data for frontend
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    // 🎟 Generate JWT
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Login successful:", email, user.role);

    res.json({
      message: "Login successful",
      token,
      user: userData,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// 📌 **3. Forgot Password (Send Reset Token)**
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found!" });

    // Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000;
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Reset Link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Email Options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Hello ${user.name},</p>
               <p>You requested to reset your password. Click the link below (valid for 1 hour):</p>
               <a href="${resetLink}">${resetLink}</a>
               <p>If you did not request this, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Reset password email sent!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 📌 **4. Reset Password (Verify Password)**
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const user = await User.findOne({ resetToken, resetTokenExpiry: { $gt: Date.now() }, });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear resetToken
    user.password = hashedPassword;
    user.resetToken = "";
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
