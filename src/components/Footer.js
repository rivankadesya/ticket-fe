import React from 'react';
import { BookOpen, ExternalLink, Heart } from 'lucide-react';
import { useTheme } from '../store/themeStore';
import { lightTheme, darkTheme } from '../theme';

const Footer = ({ minimal = false }) => {
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

  const style = {
    wrapper: {
      width: '100%',
      padding: minimal ? '16px 24px' : '20px 24px',
      borderTop: `1px solid ${t.border}`,
      backgroundColor: t.bg.secondary,
      display: 'flex',
      flexDirection: minimal ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: minimal ? '12px' : '8px',
      flexShrink: 0,
    },
    text: {
      fontSize: '12px',
      color: t.text.tertiary,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    name: {
      color: t.text.primary,
      fontWeight: '700',
    },
    link: {
      color: t.text.tertiary,
      textDecoration: 'none',
      fontSize: '11px',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'color 0.15s',
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  };

  return (
    <div style={style.wrapper}>
      <div style={style.row}>
        <a href="/documentation" style={style.link}>
          <BookOpen size={12} /> Documentation
        </a>
        <a href="https://github.com/rivankadesya" target="_blank" rel="noopener noreferrer" style={style.link}>
          <ExternalLink size={12} /> GitHub
        </a>
      </div>
      <div style={style.text}>
        &copy; {new Date().getFullYear()} <span style={style.name}>Rivanka Desya</span>
        <Heart size={11} style={{ color: '#ef4444' }} />
        All rights reserved.
      </div>
    </div>
  );
};

export default Footer;