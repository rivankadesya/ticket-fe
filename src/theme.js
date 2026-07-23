export const lightTheme = {
  bg: {
    primary: '#f4f6fa',
    secondary: '#ffffff',
    tertiary: '#f1f5f9',
    hover: '#e2e8f0',
    input: '#ffffff',
    glass: 'rgba(255, 255, 255, 0.8)',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#94a3b8',
    inverse: '#ffffff',
  },
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  shadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  shadowMd: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
  shadowLg: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)',
  shadowXl: '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
  card: '#ffffff',
  accent: '#6366f1',
  accentLight: 'rgba(99, 102, 241, 0.08)',
  accentHover: '#4f46e5',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
};

export const darkTheme = {
  bg: {
    primary: '#090d16',
    secondary: '#111827',
    tertiary: '#1f2937',
    hover: '#374151',
    input: '#111827',
    glass: 'rgba(17, 24, 39, 0.8)',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
    tertiary: '#64748b',
    inverse: '#0f172a',
  },
  border: '#334155',
  borderLight: '#1e293b',
  shadow: '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
  shadowMd: '0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.3)',
  shadowLg: '0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -4px rgba(0,0,0,0.3)',
  shadowXl: '0 20px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.4)',
  card: '#1e293b',
  accent: '#818cf8',
  accentLight: 'rgba(129, 140, 248, 0.1)',
  accentHover: '#6366f1',
  success: '#34d399',
  danger: '#f87171',
  warning: '#fbbf24',
};

export const statusColors = {
  Open: '#ef4444',
  'In Progress': '#f59e0b',
  Resolved: '#10b981',
  Closed: '#6366f1',
};

export const priorityColors = {
  Low: '#6366f1',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444',
};

export const statusIcons = {
  Open: 'circle',
  'In Progress': 'loader',
  Resolved: 'check-circle',
  Closed: 'archive',
};
