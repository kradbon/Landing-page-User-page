import mongoose, { Schema } from "mongoose";

const LogoSchema = new Schema(
  {
    key: String,
    url: String,
    contentType: String,
    size: Number
  },
  { _id: false }
);

const ThemeSchema = new Schema(
  {
    primary: String,
    secondary: String,
    background: String,
    text: String,
    font: String,
    radius: String
  },
  { _id: false }
);

const TenantSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    domain: { type: String, required: true },
    logo: LogoSchema,
    theme: ThemeSchema
  },
  { timestamps: true }
);

export const TenantModel = mongoose.model("Tenant", TenantSchema);
