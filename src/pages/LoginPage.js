import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isApproved, currentUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // isApproved is re-evaluated by AuthContext after login;
      // navigate on the next render via useEffect below.
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  // Once we have a logged-in user, decide where to send them
  React.useEffect(() => {
    if (currentUser) {
      if (isApproved) {
        navigate('/posts');
      } else {
        setPendingApproval(true);
      }
    }
  }, [currentUser, isApproved, navigate]);

  if (pendingApproval) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Awaiting Approval</h1>
          <p className="auth-info">
            Your account has been created but is pending admin approval. You
            will be able to log in once your account has been approved.
          </p>
          <button
            className="auth-btn secondary"
            onClick={() => {
              // Use the logout helper from context
              window.location.reload();
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Liminality Admin</h1>
        <p className="auth-subtitle">Sign in to manage your content</p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button type="submit" className="auth-btn primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
