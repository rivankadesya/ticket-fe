import React, { useState, useContext, useEffect } from 'react';
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

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
};

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [logoHover, setLogoHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

  useEffect(() => {
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
    <div className="login-container" style={{
      ...s.container,
      padding: isMobile ? '8px' : '20px',
    }}>
      <div style={s.blob1} />
      <div style={s.blob2} />

      <div className="login-inner" style={{
        ...s.innerContainer,
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: isMobile ? 'auto' : '560px',
        maxWidth: isMobile ? '100%' : '920px',
        borderRadius: isMobile ? '16px' : '24px',
      }}>
        <div className="login-left" style={{
          ...s.leftPanel,
          display: isMobile ? 'none' : 'flex',
        }}>
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

        <div className="login-card" style={{
          ...s.card,
          width: isMobile ? '100%' : '420px',
          maxWidth: '100%',
          padding: isMobile ? '24px 16px' : '48px 40px',
        }}>
          <div style={{
            ...s.logoWrapper,
            marginBottom: isMobile ? '20px' : '32px',
          }}>
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
            <h1 style={{
              ...s.title,
              fontSize: isMobile ? '17px' : '20px',
            }}>Welcome back</h1>
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
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            <div style={{ ...s.formGroup, marginBottom: isMobile ? '16px' : '24px', ...getFormDelay(1) }}>
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
                  borderRadius: '10px',
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