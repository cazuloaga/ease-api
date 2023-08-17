import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface PatientDocument extends mongoose.Document {
  user: UserDocument["_id"];
  name: string;
  email: string;
  procedures: Array<string>;
  createdAt: Date;
  updatedAt: Date;
  patientId: string;
}

const PatientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      default: () => `patient_${nanoid()}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    procedures: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const PatientnModel = mongoose.model<PatientDocument>("Patient", PatientSchema);

export default PatientnModel;
