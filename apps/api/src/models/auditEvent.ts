import mongoose, { Schema } from "mongoose";

const ChangeSchema = new Schema(
  {
    label: String,
    blockId: String,
    path: String,
    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed
  },
  { _id: false }
);

const AuditEventSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    pageId: { type: Schema.Types.ObjectId, ref: "LandingPage", required: true },
    slug: { type: String, required: true },
    actor: {
      userId: String,
      email: String,
      ip: String
    },
    action: {
      type: String,
      enum: ["update", "publish", "add-block", "remove-block", "reorder-blocks", "theme-change"],
      required: true
    },
    changes: [ChangeSchema],
    fromVersionId: { type: Schema.Types.ObjectId },
    toVersionId: { type: Schema.Types.ObjectId }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditEventModel = mongoose.model("AuditEvent", AuditEventSchema);
