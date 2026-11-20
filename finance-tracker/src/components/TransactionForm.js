import React, { useState } from 'react';

function TransactionForm({ onAddTransaction }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Продукти');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) {
      alert('Введіть коректну назву та суму більшу за 0');
      return;
    }

    onAddTransaction({
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      category,
      isCompleted: true,
      date: new Date().toLocaleDateString('uk-UA'),
    });

    setTitle('');
    setAmount('');
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3>Нова транзакція</h3>
      <div className="form-row">
        <input
          type="text"
          placeholder="Опис (напр. Зарплата, Кава)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Сума (₴)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="form-row">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Витрата (-)</option>
          <option value="income">Дохід (+)</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Продукти">Продукти</option>
          <option value="Транспорт">Транспорт</option>
          <option value="Зарплата">Зарплата</option>
          <option value="Розваги">Розваги</option>
          <option value="Комунальні">Комунальні</option>
          <option value="Інше">Інше</option>
        </select>

        <button type="submit" className="btn-primary">
          Додати
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;