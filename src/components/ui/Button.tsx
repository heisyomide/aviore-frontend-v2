import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = "", 
  ...props 
}: ButtonProps) {
  
  const variants = {
    primary: "bg-[#222] text-white hover:bg-black",
    outline: "border-2 border-[#222] text-[#222] hover:bg-[#222] hover:text-white",
    ghost: "text-[#666] hover:text-[#222] hover:bg-gray-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button 
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-full font-bold uppercase tracking-widest 
        transition-all duration-200 active:scale-95 
        disabled:opacity-50 disabled:pointer-events-none
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}