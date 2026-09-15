export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  title = '',
  ...props
}) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  }[variant] || 'btn-primary';

  const sizeClass = size === 'sm' ? 'btn-sm' : '';

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
}
