import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

// Register
export const register = async (req, res) => {
  const { name, email, password, googleId } = req.body;

  if (!name || !email || !password || password.length < 3 || name.length < 3) {
    return res.status(400).json({
      success: false,
      message: "❌ Missing or Invalid Details",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      googleId,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "4d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 4 * 24 * 60 * 60 * 1000, // 4 days
    });

    return res.status(201).json({
      success: true,
      message: "✅ Signup Successfully",
    });
  } catch (error) {
    // Duplicate email error (MongoDB)
    if (error.code === 11000 && error.keyValue?.email) {
      return res.status(409).json({
        success: false,
        message: "⚠️ Email already exists.",
      });
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: `Validation error: ${error.message}`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

//Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required!",
    });
  }
  try {
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      return res.json({
        success: false,
        message: " ⚠️ Invalid email",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "❌ Incorrect Password",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "4d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 4 * 24 * 60 * 60 * 1000,
    });
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to justinanurag0.2 🎉",
      text: `Hi ${email},\n\nWelcome to justinanurag0.2! 🎉\n\nYou’ve successfully logged in to our webpage.`,
      html: `
        <p>Hi <strong>${email}</strong>,</p>
        <p>Welcome to <strong>justinanurag0.2</strong>! 🎉</p>
        <p>You’ve successfully logged in to our webpage.</p>
        <p> your account has been created with email id:${email}
        <p>If this wasn’t you, please change your password immediately.</p>
        <p>Cheers,<br/>The justinanurag0.2 Team</p>
    `,
    };
    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "✅ Send mail successfully and Successfully login",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
//Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 4 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      message: "🤐 Logout Successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//Send Verification OTP to the user's Email
export const sendVerifyOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

     const user = await userModel.findOne({ email }); 

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified.",
      });
    }

    // ✅ Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // ✅ Set OTP and expiry (24 hours from now)
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // ✅ Send OTP via email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Hi ${user.name},\n\nYour OTP for verifying your account is: ${otp}\n\nThis OTP will expire in 24 hours.\n\nIf you did not request this, please ignore this message.\n\nThanks,\nTeam justinanurag0.2`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Verification OTP has been sent to your email.",
    });

  } catch (error) {
    console.error("Error in sendVerifyOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//Verify the Email using the OTP
export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }
  try {
    const user = await userModel.findOne({email});
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    //if user availabe then verify the otp
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP Expired",
      });
    }
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();
    return res.json({
      success: true,
      message: "Email verified Successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//Check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "Authenticated!!!!!",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email is required!!!",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found!!!",
      });
    }

    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Email options
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset Password OTP",
      text: `Hi ${user.name},\n\nYour OTP for resetting your password is: ${otp}\n\nThis OTP will expire in 5 minutes.\n\nIf you did not request this, please ignore this message.\n\nThanks,\nTeam justinanurag0.2`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "OTP sent to your email address",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//Reset User password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Validate inputs
  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP, and new password are required!",
    });
  }

  try {
    // Find user
    const user = await userModel.findOne({ email: email.trim() });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found!",
      });
    }

    // Check if OTP is empty or incorrect
    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    // Check if OTP is expired
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP has expired!",
      });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.json({
      success: true,
      message: "✅ Password has been reset successfully.",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
