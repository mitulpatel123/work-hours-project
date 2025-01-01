import React from 'react';
import { FormField } from './FormField';
import { Heading } from '../../types';

interface HeadingSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  headings: Heading[];
  placeholder?: string;
  className?: string;
}

const HeadingSelect: React.FC<HeadingSelectProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  headings,
  placeholder = 'Select a heading',
  className = ''
}) => {
  // Sort headings by order
  const sortedHeadings = React.useMemo(() => 
    [...headings].sort((a, b) => a.order - b.order),
    [headings]
  );

  return (
    <FormField 
      label={label} 
      name={name} 
      error={error}
      required={required}
      className={className}
    >
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        className={`
          mt-1 block w-full rounded-md shadow-sm
          ${error 
            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }
          sm:text-sm
        `}
      >
        <option value="">{placeholder}</option>
        {sortedHeadings.map((heading) => (
          <option key={heading._id} value={heading._id}>
            {heading.name}
          </option>
        ))}
      </select>
    </FormField>
  );
};

export default HeadingSelect;