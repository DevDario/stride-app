import * as React from 'react';

type Option = {
  value: string;
  label: string;
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  error?: string;
  width?: string;
  title: string;
  options: Option[];
}

export default function Select({
  leftIcon,
  fullWidth = false,
  className = '',
  options,
  error,
  title,
  width = 'w-[70%]',
  ...props
}: SelectProps) {
  return (
    <div
      className={`
                flex flex-row items-center
                border rounded-xl px-4
                bg-white
                border-neutral-200
                overflow-x-hidden
                ${fullWidth ? 'w-full' : width ? width : 'w-[70%]'}
                ${className}
            `}
    >
      {leftIcon && <div className='mr-2'>{leftIcon}</div>}

      <select
        className='flex-1 text-dark text-base py-3 border-none outline-none cursor-pointer'
        {...props}
        title={title}
      >
        <option value={''} key={`default-value`}>
          {title}
        </option>
        {options.map((option, idx) => (
          <option value={option.value} key={idx}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className='text-primary text-xs mt-1'>{error}</div>}
    </div>
  );
}
