export const validateTransaction = (req, res, next) => {
  const items = Array.isArray(req.body) ? req.body : [req.body];

  for (const item of items) {
    const { title, amount, type } = item;

    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return res.status(400).json({ message: "Некоректна назва операції (мінімум 2 символи)" });
    }

    const numAmount = Number(amount);
    if (amount === undefined || isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: "Сума має бути додатним числом" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Тип операції має бути 'income' або 'expense'" });
    }
  }

  next();
};