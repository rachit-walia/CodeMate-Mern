import express from "express";
import Session from "../models/session.js";
import { authRequired } from "../middleware/auth.js";
import { nanoid } from "nanoid";

const router = express.Router();

router.post("/", authRequired, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });
    const roomId = nanoid(6);
    const session = await Session.create({
      roomId,
      title,
      createdBy: req.user.id,
      participants: [req.user.id],
    });
    res.json({ roomId, id: session._id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:roomId/raise", authRequired, async (req, res) => {
  try {
    const session = await Session.findOne({ roomId: req.params.roomId });
    if (!session) return res.status(404).json({ error: "Not found" });
    const already = session.raisedHands.find(
      (r) => String(r.user) === String(req.user.id)
    );
    if (!already) {
      session.raisedHands.push({ user: req.user.id, at: new Date() });
      await session.save();
    }
    res.json({ ok: true, raisedHands: session.raisedHands });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
