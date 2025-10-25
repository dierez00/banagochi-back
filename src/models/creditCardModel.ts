import { Document, Schema, model, Types } from "mongoose";

export type CardType = "banortemujer" | "banorteclasica" | "banorteoro";

export interface ICreditCard extends Document {
  user: Types.ObjectId;
  cardNumber: string;
  last4: string;
  holderName: string;
  expiry: string; // MM/YY
  type: CardType;
  linked: boolean;
  createdAt: Date;
  status: "active" | "inactive" | "blocked";

  // campos nuevos para control de crédito
  maxCredit: number;       // crédito máximo asignado a la tarjeta
  cutoffDay?: number;      // día de corte (1-31) - "corte para pagar"
  creditUsed: number;      // crédito ya gastado
}

const creditCardSchema = new Schema<ICreditCard>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  cardNumber: { type: String, required: true },
  last4: { type: String, required: true },
  holderName: { type: String, required: true },
  expiry: { type: String, required: true },
  type: { type: String, enum: ["banortemujer", "banorteclasica", "banorteoro"], required: true },
  linked: { type: Boolean, default: true },

  // campos nuevos
  maxCredit: { type: Number, default: 0, min: 0 },
  cutoffDay: { type: Number, min: 1, max: 31 }, // día de corte del ciclo de facturación
  creditUsed: { type: Number, default: 0, min: 0 },

  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "inactive", "blocked"], default: "active" },
});

// Índice para búsqueda por usuario
creditCardSchema.index({ user: 1 });

export const CreditCard = model<ICreditCard>("CreditCard", creditCardSchema, "creditcards");