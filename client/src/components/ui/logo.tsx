import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export function TradingLogo({ size = 32, className = "" }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 500 500" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="250" cy="250" r="250" fill="#0B0E11" />
      <path 
        d="M130 130V370H370" 
        stroke="#F7A600" 
        strokeWidth="40" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M240 250L280 210L370 310" 
        stroke="#F7A600" 
        strokeWidth="40" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BybitLogo({ size = 32, className = "" }: LogoProps) {
  return (
    <span className={`font-bold ${className}`}>
      <span className="text-[#F7A600]">Trade</span>
      <span className="text-white">Pro</span>
    </span>
  );
}