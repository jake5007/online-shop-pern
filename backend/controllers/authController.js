import { sql } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;

const issueToken = (user, res) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.is_admin,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export const registerUser = async (req, res) => {
  const nameRegex = /^[A-Za-z가-힣\s]{2,30}$/;
  const { name, email, password } = req.body;

  if (!name || !nameRegex.test(name.trim())) {
    return res.status(400).json({
      error:
        "Name must be 2 to 30 characters long and contain only Korean or English letters",
    });
  }

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    const emailLower = email.trim().toLowerCase();
    const existingUser =
      await sql`SELECT * FROM users WHERE email = ${emailLower}`;
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [user] = await sql`
        INSERT INTO users (name, email, password_hash)
        VALUES (${name.trim()}, ${emailLower}, ${hashedPassword})
        RETURNING id, name, email, is_admin
      `;

    // Generate JWT token
    const token = issueToken(user, res);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("Register error: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const emailLower = email.trim().toLowerCase();
    const [user] = await sql`
        SELECT * FROM users WHERE email = ${emailLower}
    `;
    if (!user || !user.password_hash) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = issueToken(user, res);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (err) {
    console.log("Login error: ", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "Strict",
  });

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

export const getMe = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.status(200).json({ user });
};
