import React from 'react';

export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const baseClasses = 'inline-flex items-center font-bold tracking-wide uppercase rounded-full transition-colors';
  
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm',
  };

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    navy: 'bg-[#1B2A55] text-white',
    'navy-soft': 'bg-[#1B2A55]/10 text-[#1B2A55] border border-[#1B2A55]/20',
    coral: 'bg-[#F26D6D] text-white',
    'coral-soft': 'bg-[#FEEAEA] text-[#F26D6D] border border-[#F26D6D]/30',
    green: 'bg-[#2E9E5B] text-white',
    'green-soft': 'bg-[#EAF7EE] text-[#2E9E5B] border border-[#2E9E5B]/30',
    gold: 'bg-[#F0B429] text-[#1B2A55]',
    'gold-soft': 'bg-[#FEF7E6] text-[#B7791F] border border-[#F0B429]/40',
    red: 'bg-[#E5484D] text-white',
    'red-soft': 'bg-[#FDECEE] text-[#E5484D] border border-[#E5484D]/30',
    dark: 'bg-slate-900 text-white',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {children}
    </span>
  );
}
