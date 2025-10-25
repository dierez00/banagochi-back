import { Document, Schema, model, Types } from "mongoose";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  amount: number;
  source: "PAYROLL_DEDUCTION" | "ONE_TIME";
  apartadoId?: Types.ObjectId; // si es generado por un apartado recurrente
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

const transactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  amount: { type: Number, required: true },
  source: { type: String, enum: ["PAYROLL_DEDUCTION","ONE_TIME"], required: true },
  apartadoId: { type: Schema.Types.ObjectId, ref: "Aside" }, // vinculado si aplica
  status: { type: String, enum: ["pending","completed","failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
});

export const Transaction = model<ITransaction>("Transaction", transactionSchema, "transactions");