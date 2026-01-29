import mongoose, { Schema } from "mongoose";

const LandingPageSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    slug: { type: String, required: true },
    draftVersionId: { type: Schema.Types.ObjectId, ref: "LandingVersion" },
    publishedVersionId: { type: Schema.Types.ObjectId, ref: "LandingVersion" },
    publishedAt: { type: Date }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

LandingPageSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

export const LandingPageModel = mongoose.model("LandingPage", LandingPageSchema);
