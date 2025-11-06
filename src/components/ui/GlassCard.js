'use client';

const GlassCard = ({ 
  children, 
  className = "", 
  gradient = "from-white/20 to-white/10",
  blur = "backdrop-blur-lg",
  border = "border border-white/20",
  shadow = "shadow-xl",
  ...props 
}) => {
  return (
    <div 
      className={`
        bg-gradient-to-br ${gradient} 
        ${blur} ${border} ${shadow}
        rounded-xl
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;

export const GlassButton = ({ 
  children, 
  variant = "primary",  
  className = "",
  ...props 
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white hover:from-blue-600/90 hover:to-purple-700/90",
    secondary: "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 hover:from-gray-600/30 hover:to-gray-700/30",
    success: "bg-gradient-to-r from-green-500/80 to-emerald-600/80 text-white hover:from-green-600/90 hover:to-emerald-700/90",
    danger: "bg-gradient-to-r from-red-500/80 to-pink-600/80 text-white hover:from-red-600/90 hover:to-pink-700/90"
  };

  return (
    <button
      className={`
        ${variants[variant]}
        backdrop-blur-lg border border-white/20 
        px-6 py-3 rounded-lg font-medium
        transition-all duration-300 transform hover:scale-105
        shadow-lg hover:shadow-xl
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export const GlassInput = ({ 
  className = "", 
  error = false,
  ...props 
}) => {
  return (
    <input
      className={`
        bg-white/10 backdrop-blur-lg border border-white/20
        rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
        transition-all duration-300
        ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}
        ${className}
      `}
      {...props}
    />
  );
};
