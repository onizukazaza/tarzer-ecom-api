const User = require("../models/user");
const TokenBlacklist = require('../models/TokenBlacklist');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadProfileImage } = require("../middleware/uploadProfileImages");

const generateToken = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ตรวจสอบค่า password
    if (typeof password !== "string") {
      return res.status(400).json({ message: "Password must be a string" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultProfileImage = "public/upload/profile-os/cat.jpg";
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profileImage: defaultProfileImage,
    });

    user.password = undefined; // hide password from response
    const { accessToken, refreshToken } = generateToken(user);

    req.tokens = { accessToken, refreshToken };
    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!user.role) {
      console.log("User role is undefined");
      return res.status(400).json({ message: "User role not defined" });
    }

    const { accessToken, refreshToken } = generateToken(user);
    req.tokens = { accessToken, refreshToken };
    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const isBlacklisted = await TokenBlacklist.findOne({ where: { token: refreshToken } });
    if (isBlacklisted) {
        return res.status(403).json({ message: 'Refresh token is blacklisted' });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Invalid or expired refresh token" });
        }

        if (!decoded.id || !decoded.role) {
          return res.status(400).json({ message: "Invalid token payload" });
        }

        const userId = decoded.id;
        const user = { id: userId, role: decoded.role };

        const { accessToken , newRefreshToken } = generateToken(user);

        return res.status(200).json({ accessToken , refreshToken: newRefreshToken });
      }
    );
  } catch (err) {
    console.error("Error during refresh token:", err);
    return res
      .status(401)
      .json({ message: "Token expired", error: err.message });
  }
};
