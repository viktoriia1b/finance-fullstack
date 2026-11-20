import React, { useState } from 'react';

function BankSyncModal({ isOpen, onClose, onImportTransactions }) {
  const [selectedBank, setSelectedBank] = useState('Monobank');
  const [token, setToken] = useState('');
  const [syncing, setSyncing] = useState(false);

  if (!isOpen) return null;

  const handleSync = (e) => {
    e.preventDefault();
    setSyncing(true);

    setTimeout(() => {
      const bankTransactions = [
        {
          id: Date.now() + 1,
          title: `${selectedBank}: Супермаркет Сільпо`,
          amount: 640.5,
          type: 'expense',
          category: 'Продукти',
          isCompleted: true,
          date: new Date().toLocaleDateString('uk-UA'),
        },
        {
          id: Date.now() + 2,
          title: `${selectedBank}: Кешбек та відсотки`,
          amount: 215.0,
          type: 'income',
          category: 'Інше',
          isCompleted: true,
          date: new Date().toLocaleDateString('uk-UA'),
        },
      ];

      onImportTransactions(bankTransactions);
      setSyncing(false);
      setToken('');
      onClose();
    }, 800);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>Підключення онлайн-банкінгу</h3>
        <form onSubmit={handleSync}>
          <label>Оберіть банк:</label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
          >
            <option value="Monobank">Monobank (API)</option>
            <option value="ПриватБанк">Приват24</option>
            <option value="Ощадбанк">Ощад 24/7</option>
          </select>

          <label>API-токен або номер картки (тестовий):</label>
          <input
            type="text"
            placeholder="Введіть будь-який токен..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />

          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={syncing}>
              {syncing ? 'Синхронізація...' : 'Імпортувати виписку'}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Закрити
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BankSyncModal;