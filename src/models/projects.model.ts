import { Document, Schema, model, Types } from "mongoose";

export interface IFeedItem {
    type: "MILESTONE" | "ESCROW_PAYMENT" | "UPDATE" | "COMPLETED";
    timestamp: Date;
    text: string;
    imageUrl?: string;
}

export interface IVotingStats {
    votesNeeded: number;
    votesFor: number;
    voters: Types.ObjectId[];
}

export interface ISupplierInfo {
    name: string;
    account: string; // CLABE del proveedor
}

export interface IProject extends Document {
    title: string;
    description: string;
    coverImage: string;
    colonia: string;
    proposerId: Types.ObjectId;

    // Estado y gobernanza
    status: "VOTING" | "FUNDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
    votingStats: IVotingStats;

    // Fondeo
    fundingGoal: number;
    currentAmount: number;
    fundingDeadline: Date;

    // Escrow / Transparencia
    supplierInfo: ISupplierInfo;

    // Feed de noticias
    feed: IFeedItem[];

    creationDate: Date;
    updatedDate?: Date;
    deleteDate?: Date;
    active: boolean;
}

const feedItemSchema = new Schema<IFeedItem>({
    type: { type: String, enum: ["MILESTONE", "ESCROW_PAYMENT", "UPDATE", "COMPLETED"], required: true },
    timestamp: { type: Date, default: Date.now },
    text: { type: String, required: true },
    imageUrl: { type: String },
});

const votingStatsSchema = new Schema<IVotingStats>({
    votesNeeded: { type: Number, required: true },
    votesFor: { type: Number, default: 0 },
    voters: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const supplierInfoSchema = new Schema<ISupplierInfo>({
    name: { type: String, required: true },
    account: { type: String, required: true },
});

const projectSchema = new Schema<IProject>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String },
    colonia: { type: String, required: true },
    proposerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    status: { type: String, enum: ["VOTING", "FUNDING", "IN_PROGRESS", "COMPLETED", "REJECTED"], default: "VOTING" },
    votingStats: { type: votingStatsSchema, required: true },

    fundingGoal: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    fundingDeadline: { type: Date },

    supplierInfo: { type: supplierInfoSchema, required: true },

    feed: [feedItemSchema],

    creationDate: { type: Date, default: Date.now },
    updatedDate: { type: Date },
    deleteDate: { type: Date },
    active: { type: Boolean, default: true },
});

export const Project = model<IProject>("Project", projectSchema, "projects");