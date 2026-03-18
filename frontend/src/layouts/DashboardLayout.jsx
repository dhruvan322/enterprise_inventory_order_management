import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Package, ArrowRightLeft, LogOut } from 'lucide-react';

export default function DashboardLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Enterprise Inventory</h2>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Package size={20} />
            Products
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <ArrowRightLeft size={20} />
            Inventory Transactions
          </NavLink>
        </nav>
        
        <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', justifyContent: 'flex-start' }}>
          <LogOut size={20} />
          Logout
        </button>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
