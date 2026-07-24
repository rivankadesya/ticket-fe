import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Ticket, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../store/themeStore';
import { lightTheme, darkTheme } from '../../theme';
import { getStyles } from './styles';

const features = [
  'Real-time ticket tracking',
  'Team collaboration',
  'Priority management',
];

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [logoHover, setLogoHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

  React.useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#090d16' : '#f8f6f3';
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

  const getFeatureDelay = (i) => ({
    animationDelay: `${0.4 + i * 0.1}s`,
  });

  const getFormDelay = (i) => ({
    animation: 'fadeIn 0.4s ease-out both',
    animationDelay: `${0.45 + i * 0.08}s`,
  });

  return (
    <div style={s.container}>
      <div style={s.blob1} />
      <div style={s.blob2} />

      <div style={s.innerContainer}>
        <div style={s.leftPanel}>
          <div style={s.leftPattern} />
          <div style={s.leftGlow} />
          <div style={s.leftGlow2} />
          <div style={s.leftContent}>
            <div style={s.leftBadge}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
              IT Support Platform
            </div>
            <h1 style={s.leftTitle}>
              Track, manage,
              <span style={s.leftTitleAccent}>resolve faster</span>
            </h1>
            <p style={s.leftDesc}>
              Streamline your IT support workflow with real-time collaboration,
              smart prioritization, and instant updates.
            </p>
            {features.map((f, i) => (
              <div key={i} style={{ ...s.leftFeature, ...getFeatureDelay(i) }}>
                <div style={s.leftFeatureDot} />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div style={s.card}>
          <div style={s.logoWrapper}>
            <div style={s.logoRow}>
              <div
                style={{
                  ...s.logoIcon,
                  transform: logoHover ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0)',
                  boxShadow: logoHover ? `0 0 20px rgba(99,102,241,0.2)` : 'none',
                }}
                onMouseEnter={() => setLogoHover(true)}
                onMouseLeave={() => setLogoHover(false)}
              >
                <Ticket size={18} color={t.text.primary} />
              </div>
              <span style={s.logoText}>it-ticket</span>
            </div>
            <h1 style={s.title}>Welcome back</h1>
            <p style={s.subtitle}>Sign in to your account to continue</p>
          </div>

          {error && (
            <div style={s.error}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ ...s.formGroup, ...getFormDelay(0) }}>
              <label style={s.label}>Email</label>
              <div style={s.inputWrapper}>
                <Mail size={16} style={{ ...s.inputIcon, color: focusedField === 'email' ? t.accent : s.inputIcon.color }} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="you@company.com"
                  style={{
                    ...s.input,
                    borderColor: focusedField === 'email' ? t.accent : s.input.borderColor,
                    transform: focusedField === 'email' ? 'scale(1.01)' : 'scale(1)',
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            <div style={{ ...s.formGroup, marginBottom: '24px', ...getFormDelay(1) }}>
              <label style={s.label}>Password</label>
              <div style={s.inputWrapper}>
                <Lock size={16} style={{ ...s.inputIcon, color: focusedField === 'password' ? t.accent : s.inputIcon.color }} />
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="Enter password"
                  style={{
                    ...s.input,
                    paddingRight: '38px',
                    borderColor: focusedField === 'password' ? t.accent : s.input.borderColor,
                    transform: focusedField === 'password' ? 'scale(1.01)' : 'scale(1)',
                  }}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ ...s.eyeBtn, color: focusedField === 'password' ? t.accent : s.eyeBtn.color }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={getFormDelay(2)}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...s.submitButton(loading),
                  transform: btnHover && !loading ? 'scale(1.02) translateY(-1px)' : 'scale(1) translateY(0)',
                  boxShadow: btnHover && !loading
                    ? isDark
                      ? '0 8px 25px rgba(99,102,241,0.3)'
                      : '0 8px 25px rgba(30,41,59,0.2)'
                    : 'none',
                }}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
              >
                <LogIn size={16} />
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <p style={{ ...s.footerText, ...getFormDelay(3) }}>
            Don't have an account?{' '}
            <Link to="/register" style={s.link}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;