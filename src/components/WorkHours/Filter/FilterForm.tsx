import React from 'react';
import DateInput from '../../Forms/DateInput';
import HeadingSelect from '../../Forms/HeadingSelect';
import { useForm } from '../../../hooks/useForm';
import { Heading } from '../../../types';

interface FilterFormData {
  startDate: string;
  endDate: string;
  heading: string;
  status: string;
}

interface FilterFormProps {
  headings: Heading[];
  onFilter: (filters: FilterFormData) => Promise<void>;
}

const FilterForm: React.FC<FilterFormProps> = ({ headings, onFilter }) => {
  const { values, handleChange, handleBlur, handleSubmit } = useForm<FilterFormData>({
    initialValues: {
      startDate: '',
      endDate: '',
      heading: '',
      status: '',
    },
    validate: () => ({}),
    onSubmit: async (values) => await onFilter(values),
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <DateInput
            label="Start Date"
            name="startDate"
            value={values.startDate}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        
        <div className="sm:col-span-1">
          <DateInput
            label="End Date"
            name="endDate"
            value={values.endDate}
            onChange={handleChange}
            onBlur={handleBlur}
            min={values.startDate}
          />
        </div>

        <div className="sm:col-span-1">
          <HeadingSelect
            label="Heading"
            name="heading"
            value={values.heading}
            headings={headings.sort((a, b) => a.order - b.order)}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={values.status}
            onChange={handleChange}
            onBlur={handleBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Status</option>
            <option value="complete">Complete</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default FilterForm;