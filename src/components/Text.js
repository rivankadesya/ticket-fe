import React from 'react';

const Text = ({ children, style = {}, variant = 'body', ...props }) => {
  const variants = {
    h1: { fontSize: '28px', fontWeight: '700', lineHeight: '1.3' },
    h2: { fontSize: '22px', fontWeight: '700', lineHeight: '1.35' },
    h3: { fontSize: '18px', fontWeight: '700', lineHeight: '1.4' },
    h4: { fontSize: '15px', fontWeight: '600', lineHeight: '1.4' },
    body: { fontSize: '13px', fontWeight: '500', lineHeight: '1.5' },
    bodySm: { fontSize: '12px', fontWeight: '400', lineHeight: '1.4' },
    caption: { fontSize: '11px', fontWeight: '500', lineHeight: '1.4' },
    mono: { fontSize: '11px', fontWeight: '600', fontFamily: 'monospace', lineHeight: '1.4' },
  };

  const baseStyle = {
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
    ...variants[variant],
    ...style,
  };

  return (
    <span style={baseStyle} {...props}>
      {children}
    </span>
  );
};

export default Text;
