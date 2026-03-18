import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Inventory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/inventory/transactions');
      data.sort((a,b) => new Date(b.transactionDate) - new Date(a.transactionDate));
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockAction = async (type) => {
    const id = prompt(`Enter Product ID to ${type.replace('_', ' ')}:`);
    if (!id) return;
    const qty = prompt("Enter Quantity:");
    if (!qty || isNaN(qty) || qty <= 0) return alert("Invalid quantity");
    
    try {
      const endpoint = type === 'STOCK_IN' ? '/inventory/stock-in' : '/inventory/stock-out';
      await api.post(`${endpoint}?productId=${id}&quantity=${qty}&notes=Manual Action`);
      fetchTransactions();
      alert("Success! Inventory updated.");
    } catch (err) {
      alert(err.response?.data || "Transaction failed");
    }
  };

  return (
    <div className="animate-in">
      <div className="top-header">
        <h1>Inventory Transactions</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" style={{ backgroundColor: 'var(--success)' }} onClick={() => handleStockAction('STOCK_IN')}>Stock In</button>
          <button className="btn btn-danger" onClick={() => handleStockAction('STOCK_OUT')}>Stock Out</button>
        </div>
      </div>
      <div className="table-container glass">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading transactions...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found</td>
              </tr>
            ) : (
              transactions.map(tx => (
                <tr key={tx.id}>
                  <td>#{tx.id}</td>
                  <td>
                    <span style={{ color: tx.transactionType === 'STOCK_IN' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                      {tx.transactionType.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{tx.product?.name} (SKU: {tx.product?.sku})</td>
                  <td>
                    {tx.transactionType === 'STOCK_IN' ? '+' : '-'}{tx.quantity}
                  </td>
                  <td>{new Date(tx.transactionDate).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
