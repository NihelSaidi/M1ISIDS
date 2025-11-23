const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendPasswordResetEmail  = require("../NodeMailer/nodeMailer.js");
const crypto = require("crypto");


// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account not activated. Check your email.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ token, role: user.role, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
};


// VERIFY USER (activation)
const verifyUser = async (req, res) => {
  try {
    const user = await User.findOne({
      activationCode: req.params.activationCode,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid activation code" });
    }

    user.isActive = true;
    user.activationCode = null;
    await user.save();

    res.status(200).json({ message: "Account successfully activated" });
  } catch (err) {
    res.status(500).json({ message: "Activation failed" });
  }
};


// GET ME
const getMe = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to get user data." });
  }
};


// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    console.log("Requête reçue avec email :", req.body.email);

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Utilisateur non trouvé !");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("Utilisateur trouvé :", user.email);

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    console.log("Envoi email...");

    await sendPasswordResetEmail(user.email, resetToken);

    res
      .status(200)
      .json({ success: true, message: "Password reset email sent." });
  } catch (err) {
    console.error("Erreur :", err);
    res.status(500).json({
      success: false,
      message: "Error sending password reset email.",
    });
  }
};


// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password successfully reset." });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error resetting password.",
    });
  }
};


// EXPORTS
module.exports = {
  login,
  verifyUser,
  getMe,
  forgotPassword,
  resetPassword,
};
