import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, lowStock: 0, transactions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, txRes] = await Promise.all([
          api.get('/products'),
          api.get('/inventory/transactions')
        ]);
        
        const products = productsRes.data;
        const transactions = txRes.data;
        
        setStats({
          products: products.length,
          lowStock: products.filter(p => p.stockQuantity < 10).length,
          transactions: transactions.length
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="animate-in">
      <div className="top-header">
        <h1>Dashboard</h1>
      </div>
      
      <div className="dashboard-grid">
        <div className="stat-card glass" style={{ borderTop: '4px solid var(--primary-color)' }}>
          <span className="stat-title">Total Products</span>
          <span className="stat-value">{loading ? '...' : stats.products}</span>
        </div>
        <div className="stat-card glass" style={{ borderTop: '4px solid var(--warning)' }}>
          <span className="stat-title">Low Stock Items</span>
          <span className="stat-value">{loading ? '...' : stats.lowStock}</span>
        </div>
        <div className="stat-card glass" style={{ borderTop: '4px solid var(--success)' }}>
          <span className="stat-title">Total Transactions</span>
          <span className="stat-value">{loading ? '...' : stats.transactions}</span>
        </div>
      </div>
    </div>
  );
}
