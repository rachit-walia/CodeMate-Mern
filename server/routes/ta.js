import express from "express";
import Session from "../models/session.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/active-sessions",
  authRequired,
  requireRole("ta"),
  async (req, res) => {
    const since = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const sessions = await Session.find({ updatedAt: { $gte: since } })
      .populate("participants", "name")
      .populate("raisedHands.user", "name")
      .lean();
    res.json(sessions);
  }
);

export default router;
