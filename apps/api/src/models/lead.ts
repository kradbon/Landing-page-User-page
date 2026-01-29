import mongoose, { Schema } from "mongoose";

const LeadSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    pageId: { type: Schema.Types.ObjectId, ref: "LandingPage", required: true },
    status: { type: String, enum: ["PENDING", "ACCEPTED", "DECLINED"], required: true },
    applicant: {
      firstName: String,
      lastName: String,
      phone: String,
      email: String
    },
    submittedAt: { type: Date, required: true },
    decidedAt: { type: Date },
    decidedBy: { type: String },
    invite: {
      token: String,
      expiresAt: Date,
      usedAt: Date
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const LeadModel = mongoose.model("Lead", LeadSchema);
