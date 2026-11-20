import React, { useState } from 'react';

function TransactionList({
  transactions,
  onDelete,
  onEdit,
  onToggleStatus,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editType, setEditType] = useState('expense');

  const startEditing = (tx) => {
    setEditingId(tx.id);
    setEditTitle(tx.title);
    setEditAmount(tx.amount);
    setEditType(tx.type);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = (tx) => {
    if (!editTitle.trim() || Number(editAmount) <= 0) return;
    onEdit(tx.id, {
      ...tx,
      title: editTitle.trim(),
      amount: parseFloat(editAmount),
      type: editType,
    });
    setEditingId(null);
  };

  if (transactions.length === 0) {
    return <p className="empty-msg">Транзакцій за обраним фільтром немає.</p>;
  }

  return (
    <ul className="transaction-list">
      {transactions.map((tx) => (
        <li
          key={tx.id}
          className={`transaction-item ${tx.type} ${
            !tx.isCompleted ? 'pending' : ''
          }`}
        >
          {editingId === tx.id ? (
            <div className="edit-row">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
              />
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
              >
                <option value="expense">Витрата</option>
                <option value="income">Дохід</option>
              </select>
              <button className="btn-save" onClick={() => saveEdit(tx)}>
                Зберегти
              </button>
              <button className="btn-cancel" onClick={cancelEditing}>
                Скасувати
              </button>
            </div>
          ) : (
            <>
              <div className="tx-info">
                <input
                  type="checkbox"
                  checked={tx.isCompleted}
                  onChange={() => onToggleStatus(tx)}
                  title="Відмітити як проведену/заплановану"
                />
                <div>
                  <span className="tx-title">{tx.title}</span>
                  <div className="tx-meta">
                    <span className="badge">{tx.category}</span>
                    <span>{tx.date}</span>
                    <span className="status-tag">
                      {tx.isCompleted ? '✔ Проведено' : '⏳ Заплановано'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="tx-actions">
                <span className={`tx-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}
                  {Number(tx.amount).toFixed(2)} ₴
                </span>
                <button
                  className="btn-edit"
                  onClick={() => startEditing(tx)}
                  title="Редагувати"
                >
                  ✏️
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(tx.id)}
                  title="Видалити"
                >
                  🗑️
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TransactionList;