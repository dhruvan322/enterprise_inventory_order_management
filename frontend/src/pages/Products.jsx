import { useState, useEffect } from 'react';
import api from '../services/api';

const AddProductModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name, sku, price: parseFloat(price), stockQuantity: 0 });
    setName(''); setSku(''); setPrice('');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div className="glass animate-in" style={{ padding: '2rem', borderRadius: '1rem', width: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input className="input-field" required value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div className="input-group">
            <label>SKU</label>
            <input className="input-field" required value={sku} onChange={e=>setSku(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Price</label>
            <input className="input-field" type="number" step="0.01" required value={price} onChange={e=>setPrice(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save</button>
            <button type="button" className="btn" style={{ flex: 1, justifyContent: 'center', border: '1px solid var(--border-color)' }} onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (prod) => {
    try {
      await api.post('/products', prod);
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert("Failed to create product.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  return (
    <div className="animate-in">
      <div className="top-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Add Product</button>
      </div>
      <div className="table-container glass">
        <table className="modern-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading products...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No products found</td>
              </tr>
            ) : (
              products.map(p => (
                <tr key={p.id}>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.category?.name || 'Uncategorized'}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>
                    <span style={{ color: p.stockQuantity < 10 ? 'var(--warning)' : 'var(--text-main)', fontWeight: 'bold' }}>
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <AddProductModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onAdd={handleCreate} />
    </div>
  );
}
