'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#111827] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            ${error 
              ? 'border-[#DC2626] focus:ring-[#DC2626] focus:border-[#DC2626]' 
              : 'border-gray-300 focus:ring-[#10B981] focus:border-[#10B981]'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            placeholder:text-[#6B7280]
            bg-white
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[#DC2626]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-[#6B7280]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
