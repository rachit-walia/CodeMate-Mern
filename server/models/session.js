import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    roomId: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    raisedHands: [
      { user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, at: Date },
    ],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
