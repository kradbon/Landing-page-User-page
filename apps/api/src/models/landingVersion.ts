import mongoose, { Schema } from "mongoose";

const LandingVersionSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    pageId: { type: Schema.Types.ObjectId, ref: "LandingPage", required: true },
    version: { type: Number, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    createdBy: { type: String },
    reason: { type: String, enum: ["autosave", "manual-save", "publish"], required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const LandingVersionModel = mongoose.model("LandingVersion", LandingVersionSchema);
