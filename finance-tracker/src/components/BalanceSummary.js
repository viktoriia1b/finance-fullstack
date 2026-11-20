import React from 'react';

function BalanceSummary({ transactions, usdRate, onOpenBankModal }) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = income - expense;
  const completedCount = transactions.filter((t) => t.isCompleted).length;

  return (
    <div className="summary-card">
      <div className="summary-header">
        <div>
          <span className="label">Поточний баланс</span>
          <h2 className={balance >= 0 ? 'positive' : 'negative'}>
            {balance.toFixed(2)} ₴
          </h2>
          {usdRate && (
            <small className="rate-info">
              ≈ ${(balance / usdRate).toFixed(2)} USD (курс: {usdRate} ₴)
            </small>
          )}
        </div>
        <button className="btn-bank" onClick={onOpenBankModal}>
          🏦 Онлайн-банкінг
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-box income-box">
          <span>Доходи</span>
          <strong>+{income.toFixed(2)} ₴</strong>
        </div>
        <div className="stat-box expense-box">
          <span>Витрати</span>
          <strong>-{expense.toFixed(2)} ₴</strong>
        </div>
        <div className="stat-box tracking-box">
          <span>Трекінг (проведено)</span>
          <strong>
            {completedCount} з {transactions.length}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default BalanceSummary;