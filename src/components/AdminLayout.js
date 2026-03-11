import { Link } from 'react-router-dom';

function AdminLayout({ title, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/posts" className="brand">Liminality Admin</Link>
          <div className="topbar-actions">
            {/* Removed logout and user info */}
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
