import React from 'react';
import { FormField } from './FormField';

interface DateInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  min?: string;
  max?: string;
  disabled?: boolean;  // Added disabled prop
  className?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  min,
  max,
  disabled = false,  // Added with default value
  className = '',
}) => {
  return (
    <FormField
      label={label}
      name={name}
      error={error}
      required={required}
      className={className}
    >
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        min={min}
        max={max}
        disabled={disabled}  // Added disabled attribute
        className={`
          mt-1
          block
          w-full
          rounded-md
          shadow-sm
          ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          sm:text-sm
        `}
      />
    </FormField>
  );
};

export default DateInput;
