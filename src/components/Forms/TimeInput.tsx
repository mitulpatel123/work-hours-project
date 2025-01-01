import React from 'react';
import { FormField } from './FormField';

interface TimeInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  min = '00:00',
  max = '23:59',
  className = ''
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
        type="time"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        min={min}
        max={max}
        className={`
          mt-1 block w-full rounded-md shadow-sm
          ${error 
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }
          sm:text-sm
        `}
      />
    </FormField>
  );
};

export default TimeInput;