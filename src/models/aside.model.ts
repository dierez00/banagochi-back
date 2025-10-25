import { Document, Schema, model, Types } from "mongoose";

export interface IAside extends Document {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  amountPerCycle: number;
  frequency: "WEEKLY" | "BIWEEKLY" | "MONTHLY"; // Ej. QUINCENAL -> BIWEEKLY
  status: "ACTIVE" | "PAUSED" | "CANCELLED";
  totalContributed: number; // suma denormalizada
  createdAt: Date;
  updatedAt?: Date;
}

const asideSchema = new Schema<IAside>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  amountPerCycle: { type: Number, required: true },
  frequency: { type: String, enum: ["WEEKLY","BIWEEKLY","MONTHLY"], required: true },
  status: { type: String, enum: ["ACTIVE","PAUSED","CANCELLED"], default: "ACTIVE" },
  totalContributed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export const Aside = model<IAside>("Aside", asideSchema, "apartados");