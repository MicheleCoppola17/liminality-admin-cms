import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLayout({ title, children }) {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/posts" className="brand">Liminality Admin</Link>
          <div className="topbar-actions">
            {currentUser && (
              <>
                <span className="topbar-email">{currentUser.email}</span>
                <button className="topbar-logout-btn" onClick={handleLogout}>
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="container">
        {title ? <h1 className="page-title">{title}</h1> : null}
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
