import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import BalanceSummary from './components/BalanceSummary';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BankSyncModal from './components/BankSyncModal';

const API_URL = 'http://localhost:5000/api/transactions';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all | income | expense | pending
  const [usdRate, setUsdRate] = useState(null);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  // 1. GET-запит при монтуванні компонента: завантажуємо дані з PostgreSQL
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);
        setTransactions(res.data);

        // Отримання актуального курсу USD від НБУ
        const rateRes = await axios.get(
          'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json'
        );
        if (rateRes.data && rateRes.data[0]) {
          setUsdRate(rateRes.data[0].rate.toFixed(2));
        }
      } catch (err) {
        console.error('Помилка завантаження даних:', err);
        setError('Не вдалося завантажити дані з сервера.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 2. POST-запит: Додавання нової транзакції в PostgreSQL
  const addTransaction = async (newTx) => {
    try {
      const response = await axios.post(API_URL, {
        ...newTx,
        amount: Number(newTx.amount),
      });
      // Сервер повертає створений запис із реальним id із PostgreSQL
      setTransactions((prev) => [response.data, ...prev]);
    } catch (err) {
      console.error('Помилка POST-запиту:', err);
      alert(err.response?.data?.message || 'Помилка збереження на сервері');
    }
  };

  // 3. PUT-запит: Редагування транзакції в PostgreSQL
  const editTransaction = async (id, updatedTx) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        ...updatedTx,
        amount: Number(updatedTx.amount),
      });
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? response.data : tx))
      );
    } catch (err) {
      console.error('Помилка PUT-запиту:', err);
      alert('Не вдалося оновити запис');
    }
  };

  // 4. PUT-запит: Трекінг статусу (Проведено / Заплановано)
  const toggleTransactionStatus = async (tx) => {
    const updated = { ...tx, isCompleted: !tx.isCompleted };
    await editTransaction(tx.id, updated);
  };

  // 5. DELETE-запит: Видалення транзакції з PostgreSQL
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      console.error('Помилка DELETE-запиту:', err);
      alert('Не вдалося видалити запис');
    }
  };

  // Імпорт з онлайн-банкінгу зі збереженням у PostgreSQL
  const importBankTransactions = async (importedList) => {
    try {
      const response = await axios.post(API_URL, importedList);
      setTransactions((prev) => [...response.data, ...prev]);
    } catch (err) {
      console.error('Помилка імпорту:', err);
      alert('Не вдалося зберегти імпортовані транзакції');
    }
  };

  // Фільтрація списку
  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'income') return tx.type === 'income';
    if (filter === 'expense') return tx.type === 'expense';
    if (filter === 'pending') return !tx.isCompleted;
    return true;
  });

  return (
    <div className="container">
      <header className="app-header">
        <h1>💰 Фінансовий трекер</h1>
        <p>Облік особистих доходів, витрат та синхронізація з банкінгом</p>
      </header>

      <BalanceSummary
        transactions={transactions}
        usdRate={usdRate}
        onOpenBankModal={() => setIsBankModalOpen(true)}
      />

      <TransactionForm onAddTransaction={addTransaction} />

      <div className="filter-bar">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Усі ({transactions.length})
        </button>
        <button
          className={filter === 'income' ? 'active' : ''}
          onClick={() => setFilter('income')}
        >
          Доходи
        </button>
        <button
          className={filter === 'expense' ? 'active' : ''}
          onClick={() => setFilter('expense')}
        >
          Витрати
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Заплановані
        </button>
      </div>

      {loading ? (
        <p className="loading-msg">Завантаження транзакцій...</p>
      ) : error ? (
        <p className="error-msg">{error}</p>
      ) : (
        <TransactionList
          transactions={filteredTransactions}
          onDelete={deleteTransaction}
          onEdit={editTransaction}
          onToggleStatus={toggleTransactionStatus}
        />
      )}

      <BankSyncModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        onImportTransactions={importBankTransactions}
      />
    </div>
  );
}

export default App; 