import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

function signTokens(payload) {
  const access = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refresh = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { access, refresh };
}

function setCookies(res, tokens) {
  res.cookie("access", tokens.access, { httpOnly: true, sameSite: "lax" });
  res.cookie("refresh", tokens.refresh, { httpOnly: true, sameSite: "lax" });
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Missing fields" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email exists" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role === "ta" ? "ta" : "student",
    });
    const tokens = signTokens({
      id: user._id,
      role: user.role,
      name: user.name,
    });
    setCookies(res, tokens);
    res.json({ id: user._id, name: user.name, role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const tokens = signTokens({
      id: user._id,
      role: user.role,
      name: user.name,
    });
    setCookies(res, tokens);
    res.json({ id: user._id, name: user.name, role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("access");
  res.clearCookie("refresh");
  res.json({ ok: true });
});

export default router;
