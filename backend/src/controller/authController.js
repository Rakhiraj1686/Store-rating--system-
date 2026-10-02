import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findById, findByEmail, updatePassword } from "../models/userModel.js";

const roles = ["admin", "user", "store_owner"];
const passwordRule = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
const passwordError =
  "Password must be 8-16 characters with one uppercase letter and one special character";

function checkSignup({ name, email, address, password, role }) {
  if (!name || !email || !address || !password) {
    return "All required fields must be filled";
  }
  if (!['user', 'store_owner'].includes(role)) {
    return "Invalid signup role";
  }
  if (name.trim().length < 2 || name.trim().length > 60) {
    return "Name must be between 2 and 60 characters";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "Please enter a valid email address";
  }
  if (address.trim().length > 400) {
    return "Address cannot exceed 400 characters";
  }
  if (!passwordRule.test(password)) {
    return passwordError;
  }
  return "";
}

export async function signup(req, res) {
  const body = req.body || {};
  const error = checkSignup(body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await createUser({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      address: body.address.trim(),
      password: hashedPassword,
      role: body.role,
    });

    res.status(201).json({ message: "Account created successfully", user });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Email already registered" });
    }
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function login(req, res) {
  const { email, password, role } = req.body || {};

  if (!email || !password || !role) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }
  if (!roles.includes(role)) {
    return res.status(400).json({ message: "Invalid role selected" });
  }

  try {
    const user = await findByEmail(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: "Selected role does not match this account." });
    }

    // the role in the token comes from the database, not from the request
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }
  if (!passwordRule.test(newPassword)) {
    return res.status(400).json({ message: passwordError });
  }

  try {
    // user id comes from the token
    const user = await findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different" });
    }

    await updatePassword(user.id, await bcrypt.hash(newPassword, 10));
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err.message);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}
