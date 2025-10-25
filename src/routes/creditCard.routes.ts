import { Router } from "express";
import {
  createCard,
  getUserCards,
  getCardById,
  updateCard,
  deleteCard,
} from "../controllers/creditCard.controller";

const router = Router();

/**
 * POST /api/cards
 * body: { userId, cardNumber, holderName, expiry, type }
 */
router.post("/", createCard);

/**
 * GET /api/cards/user/:userId
 */
router.get("/user/:userId", getUserCards);

/**
 * GET /api/cards/:id
 */
router.get("/:id", getCardById);

/**
 * PATCH /api/cards/:id
 */
router.patch("/:id", updateCard);

/**
 * DELETE /api/cards/:id
 */
router.delete("/:id", deleteCard);

export default router;