import { Document, Schema, model, Types } from "mongoose";
import { IRole, roleSchema } from "./roleModel"; // Importa el esquema de roles

// Dispositivo
export interface IDevice {
  deviceId: string;
  deviceName?: string;
  token: string;
  lastLogin: Date;
}

// Usuario
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: IRole[];
  devices: IDevice[];
  colony?: string;
  banorteAccount?: {
    number: string;
    alias?: string;
    linked: boolean;
    balance: number;
  };
  savedProjects?: Types.ObjectId[];
  votedProjects?: Types.ObjectId[];
  proposedProjects?: Types.ObjectId[];
  impactSummary?: {
    totalContributed: number;
    completedProjects: number;
    balanceContributed?: number;
  };
  creationDate: Date;
  deleteDate?: Date;
  status: boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: [roleSchema],
    required: true,
    validate: [
      {
        validator: (arr: any[]) => arr.length > 0,
        message: "The user must have at least one role",
      },
    ],
  },
  devices: [
    {
      deviceId: { type: String, required: true },
      deviceName: { type: String },
      token: { type: String, required: true },
      lastLogin: { type: Date, default: Date.now },
    },
  ],
  colony: { type: String },
  banorteAccount: {
    number: { type: String },
    alias: { type: String },
    linked: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },
  },
  savedProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  votedProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  proposedProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  impactSummary: {
    totalContributed: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    balanceContributed: { type: Number, default: 0 },
  },
  creationDate: { type: Date, default: Date.now },
  deleteDate: { type: Date },
  status: { type: Boolean, default: true },
});

// Exportamos el modelo
export const User = model<IUser>("User", userSchema, "user");
