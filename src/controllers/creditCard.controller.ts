import { Request, Response } from "express";
import { CreditCard } from "../models/creditCardModel";
import { User } from "../models/userModel";
import mongoose from "mongoose";

const VALID_TYPES = ["banortemujer", "banorteclasica", "banorteoro"];

export const createCard = async (req: Request, res: Response) => {
  try {
    const { userId, cardNumber, holderName, expiry, type, maxCredit, cutoffDay } = req.body;

    if (!userId || !cardNumber || !holderName || !expiry || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ message: "Invalid card type" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    if (cutoffDay !== undefined && (cutoffDay < 1 || cutoffDay > 31)) {
      return res.status(400).json({ message: "cutoffDay must be between 1 and 31" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const last4 = String(cardNumber).slice(-4);

    const card = new CreditCard({
      user: user._id,
      cardNumber, // en producción guarda token, no PAN
      last4,
      holderName,
      expiry,
      type,
      linked: true,
      maxCredit: typeof maxCredit === "number" ? maxCredit : 0,
      cutoffDay: cutoffDay ? cutoffDay : undefined,
      creditUsed: 0,
    });

    await card.save();

    // agregar referencia a usuario si existe el campo
    try {
      // @ts-ignore en caso de que user model no tenga creditCards definido aún
      user.creditCards = user.creditCards || [];
      // @ts-ignore
      user.creditCards.push(card._id);
      await user.save();
    } catch {
      // no bloquear creación si update user falla
    }

    // Responder sin exponer el PAN completo
    const safeCard = card.toObject();
    delete (safeCard as any).cardNumber;

    return res.status(201).json(safeCard);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserCards = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid userId" });

    // No devolver el PAN completo por seguridad
    const cards = await CreditCard.find({ user: userId }).select("-cardNumber").lean();
    return res.status(200).json(cards);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const card = await CreditCard.findById(id).select("-cardNumber");
    if (!card) return res.status(404).json({ message: "Card not found" });
    return res.status(200).json(card);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: any = { ...req.body };

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    if (updates.type && !VALID_TYPES.includes(updates.type)) {
      return res.status(400).json({ message: "Invalid card type" });
    }

    if (updates.cutoffDay !== undefined && (updates.cutoffDay < 1 || updates.cutoffDay > 31)) {
      return res.status(400).json({ message: "cutoffDay must be between 1 and 31" });
    }

    // Si actualizan cardNumber, recalcular last4 (y en producción tokenizar)
    if (updates.cardNumber) {
      updates.last4 = String(updates.cardNumber).slice(-4);
      // opcional: no devolver cardNumber en respuesta siguiente
    }

    const card = await CreditCard.findByIdAndUpdate(id, updates, { new: true }).select("-cardNumber");
    if (!card) return res.status(404).json({ message: "Card not found" });
    return res.status(200).json(card);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const card = await CreditCard.findByIdAndDelete(id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    // remover referencia del usuario si existe el campo
    try {
      await User.findByIdAndUpdate(card.user, { $pull: { creditCards: card._id } });
    } catch {
      // ignorar error no critico
    }

    return res.status(200).json({ message: "Card deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};