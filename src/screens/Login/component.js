import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Ticket } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../store/themeStore';
import { lightTheme, darkTheme } from '../../theme';
import { getStyles } from './styles';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

  React.useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#0f172a' : '#eef2ff';
  }, [isDark]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const s = getStyles(t, isDark);

  return (
    <div style={s.container}>
      <div style={s.card}>
        <div style={s.logoWrapper}>
          <div style={s.logoIcon}>
            <Ticket size={28} color="#fff" />
          </div>
          <h1 style={s.title}>Welcome back</h1>
          <p style={s.subtitle}>Sign in to your account</p>
        </div>

        {error && (
          <div style={s.error}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={s.formGroup}>
            <label style={s.label}>Email</label>
            <div style={s.inputWrapper}>
              <Mail size={18} style={{ ...s.inputIcon, color: t.text.tertiary }} />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="you@company.com"
                style={s.input}
              />
            </div>
          </div>

          <div style={{ ...s.formGroup, marginBottom: '24px' }}>
            <label style={s.label}>Password</label>
            <div style={s.inputWrapper}>
              <Lock size={18} style={{ ...s.inputIcon, color: t.text.tertiary }} />
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="Enter password"
                style={s.input}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={s.submitButton(loading)}>
            <LogIn size={18} />
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={s.footerText}>
          Don't have an account?{' '}
          <Link to="/register" style={s.link}>Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
