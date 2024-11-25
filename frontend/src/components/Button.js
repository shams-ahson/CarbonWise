import React from 'react';

function Button({
  label,
  onClick,
  type = 'button',
  style = {},
  disabled = false,
  variant = 'primary',
}) {
  const baseStyle = {
    margin: '10px',
    padding: '10px 20px',
    width: '450px',
    fontFamily: 'Lilita One, sans-serif',
    fontSize: '16px',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    ...style,
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#608A33',
      hover: '#4D6F28',
    },
    accent: {
      backgroundColor: '#93BA85',
      hover: '#7CA370',
    },
  };

  const currentVariantStyle = variantStyles[variant];
  const buttonStyle = { ...baseStyle, backgroundColor: currentVariantStyle.backgroundColor };

  return (
    <button
      type={type}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      onMouseOver={(e) => (e.target.style.backgroundColor = currentVariantStyle.hover)}
      onMouseOut={(e) => (e.target.style.backgroundColor = currentVariantStyle.backgroundColor)}
    >
      {label}
    </button>
  );
}

export default Button;
