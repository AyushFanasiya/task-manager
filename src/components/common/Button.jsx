import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick, 
  fullWidth, 
  disabled,
  type = 'button',
  icon,
  className = '' 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        btn 
        btn-${variant} 
        btn-${size} 
        ${fullWidth ? 'btn-full-width' : ''} 
        ${disabled ? 'btn-disabled' : ''}
        ${className}
      `}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;