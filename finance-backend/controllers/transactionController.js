import { Transaction } from "../models/Transaction.js";

// GET /api/transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [["id", "DESC"]],
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/transactions (підтримує і один об'єкт, і масив із банку)
export const createTransaction = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const cleaned = req.body.map(({ id, ...rest }) => ({
        ...rest,
        amount: Number(rest.amount),
      }));
      const createdList = await Transaction.bulkCreate(cleaned);
      return res.status(201).json(createdList);
    }

    const { id, ...data } = req.body;
    const transaction = await Transaction.create({
      ...data,
      amount: Number(data.amount),
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/transactions/:id
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({ message: "Транзакцію не знайдено" });
    }

    await transaction.update({
      ...req.body,
      amount: Number(req.body.amount),
    });
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Транзакцію не знайдено" });
    }

    res.json({ message: "Видалено успішно" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};