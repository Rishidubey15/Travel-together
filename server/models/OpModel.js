import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userOrgSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    workEmail: { type: String, required: true },
    name: { type: String, required: true },
    derivedCompanyName: { type: String, required: true },
    jobTitle: { type: String },
    companyDomain: { type: String },
    assignedCategory: { type: String },
    allotedCompanyId: {type: String}
  },
  { timestamps: true }
);

const orgSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    knownCategories: { type: [String], default: [] },
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, required: true, default: false },
    isVerified: { type: Boolean, required: true, default: false },
    name: { type: String, required: true },
  },
  { timestamps: true, collection: "user" } 
  
);

export const User = model("User", userSchema);
export const UserOrg = model("UserOrg", userOrgSchema);
export const Org = model("Org", orgSchema);