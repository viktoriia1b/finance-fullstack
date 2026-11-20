import express from "express";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { validateTransaction } from "../middleware/validateTransaction.js";

const router = express.Router();

router.get("/", getTransactions);
router.post("/", validateTransaction, createTransaction);
router.put("/:id", validateTransaction, updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;