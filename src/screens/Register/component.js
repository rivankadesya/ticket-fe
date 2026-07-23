import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Ticket } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../store/themeStore';
import { lightTheme, darkTheme } from '../../theme';
import { getStyles } from './styles';

const RegisterComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
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
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
          <h1 style={s.title}>Create account</h1>
          <p style={s.subtitle}>Get started with your workspace</p>
        </div>

        {error && (
          <div style={s.error}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={s.formGroup}>
            <label style={s.label}>Full Name</label>
            <div style={s.inputWrapper}>
              <User size={18} style={{ ...s.inputIcon, color: t.text.tertiary }} />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" style={s.input} />
            </div>
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Email</label>
            <div style={s.inputWrapper}>
              <Mail size={18} style={{ ...s.inputIcon, color: t.text.tertiary }} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" style={s.input} />
            </div>
          </div>

          <div style={{ ...s.formGroup, marginBottom: '24px' }}>
            <label style={s.label}>Password</label>
            <div style={s.inputWrapper}>
              <Lock size={18} style={{ ...s.inputIcon, color: t.text.tertiary }} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="8" placeholder="Min. 8 characters" style={s.input} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={s.submitButton(loading)}>
            <UserPlus size={18} />
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <p style={s.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={s.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterComponent;
