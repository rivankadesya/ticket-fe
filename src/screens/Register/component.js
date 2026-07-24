import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Ticket, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../store/themeStore';
import { lightTheme, darkTheme } from '../../theme';
import { getStyles } from './styles';

const benefits = [
  'Real-time ticket updates',
  'Team collaboration tools',
  'Priority-based routing',
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

const RegisterComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [logoHover, setLogoHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile();
  const { register } = useContext(AuthContext);
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
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
    <div style={{
      ...s.container,
      padding: isMobile ? '8px' : '20px',
    }}>
      <div style={s.blob1} />
      <div style={s.blob2} />

      <div className="reg-inner" style={{
        ...s.innerContainer,
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: isMobile ? 'auto' : '560px',
        maxWidth: isMobile ? '100%' : '920px',
        borderRadius: isMobile ? '16px' : '24px',
      }}>
        <div style={{
          ...s.leftPanel,
          display: isMobile ? 'none' : 'flex',
        }}>
          <div style={s.leftPattern} />
          <div style={s.leftGlow} />
          <div style={s.leftGlow2} />
          <div style={s.leftContent}>
            <div style={s.leftBadge}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
              Get Started Free
            </div>
            <h1 style={s.leftTitle}>
              Join your team
              <span style={s.leftTitleAccent}>in one click</span>
            </h1>
            <p style={s.leftDesc}>
              Create your account and start collaborating with your team
              on IT support tickets in real time.
            </p>
            {benefits.map((f, i) => (
              <div key={i} style={{ ...s.leftFeature, ...getFeatureDelay(i) }}>
                <div style={s.leftFeatureDot} />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="reg-card" style={{
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
                  boxShadow: logoHover ? '0 0 20px rgba(16,185,129,0.2)' : 'none',
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
            }}>Create account</h1>
            <p style={s.subtitle}>Get started with your workspace</p>
          </div>

          {error && (
            <div style={s.error}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ ...s.formGroup, ...getFormDelay(0) }}>
              <label style={s.label}>Full Name</label>
              <div style={s.inputWrapper}>
                <User size={16} style={{ ...s.inputIcon, color: focusedField === 'name' ? t.accent : s.inputIcon.color }} />
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  placeholder="John Doe"
                  style={{
                    ...s.input,
                    borderColor: focusedField === 'name' ? t.accent : s.input.borderColor,
                  }}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            <div style={{ ...s.formGroup, ...getFormDelay(1) }}>
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

            <div style={{ ...s.formGroup, marginBottom: isMobile ? '16px' : '24px', ...getFormDelay(2) }}>
              <label style={s.label}>Password</label>
              <div style={s.inputWrapper}>
                <Lock size={16} style={{ ...s.inputIcon, color: focusedField === 'password' ? t.accent : s.inputIcon.color }} />
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  minLength="8" placeholder="Min. 8 characters"
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

            <div style={getFormDelay(3)}>
              <button
                type="submit"
                disabled={loading}
                style={s.submitButton(loading)}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
              >
                <UserPlus size={16} />
                {loading ? 'Creating...' : 'Create account'}
              </button>
            </div>
          </form>

          <p style={{ ...s.footerText, ...getFormDelay(4) }}>
            Already have an account?{' '}
            <Link to="/login" style={s.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;