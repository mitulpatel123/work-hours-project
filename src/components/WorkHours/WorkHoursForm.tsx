import React from 'react';
import { useForm } from '../../hooks/useForm';
import { useWorkHours } from '../../context/WorkHoursContext';
import DateInput from '../Forms/DateInput';
import TimeInput from '../Forms/TimeInput';
import HeadingSelect from '../Forms/HeadingSelect';
import {
  validateDateRange,
  validateTimeRange
} from '../../utils/dateUtils';
import type { WorkHourFormData } from '../../types';

interface WorkHoursFormProps {
  onSubmit: (data: WorkHourFormData) => Promise<void>;
  initialData?: WorkHourFormData;
  submitLabel?: string;
}

const WorkHoursForm: React.FC<WorkHoursFormProps> = ({
  onSubmit,
  initialData,
  submitLabel = 'Save Work Hours',
}) => {
  const { headings } = useWorkHours();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
  } = useForm<WorkHourFormData>({
    initialValues: initialData || {
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      heading: '',
    },
    validate: (vals) => {
      const fieldErrors: Partial<Record<keyof WorkHourFormData, string>> = {};

      // Required fields
      if (!vals.startDate) fieldErrors.startDate = 'Start date is required';
      if (!vals.endDate) fieldErrors.endDate = 'End date is required';
      if (!vals.startTime) fieldErrors.startTime = 'Start time is required';
      if (!vals.endTime) fieldErrors.endTime = 'End time is required';
      if (!vals.heading) fieldErrors.heading = 'Heading is required';

      // Date range validation
      if (vals.startDate && vals.endDate) {
        const dateOk = validateDateRange(vals.startDate, vals.endDate);
        if (!dateOk) {
          fieldErrors.endDate = 'End date must be after or equal to start date';
        }
      }

      // Time range validation
      // Only enforce "endTime > startTime" if both times are on the same date.
      if (vals.startDate === vals.endDate) {
        if (
          vals.startTime &&
          vals.endTime &&
          !validateTimeRange(vals.startTime, vals.endTime)
        ) {
          fieldErrors.endTime = 'End time must be after start time';
        }
      }

      return fieldErrors;
    },
    onSubmit: async (vals) => {
      await onSubmit(vals);
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            <DateInput
              label="Start Date"
              name="startDate"
              value={values.startDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.startDate ? errors.startDate : undefined}
              required
            />
            <DateInput
              label="End Date"
              name="endDate"
              value={values.endDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.endDate ? errors.endDate : undefined}
              required
              min={values.startDate}
            />
            <TimeInput
              label="Start Time"
              name="startTime"
              value={values.startTime}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.startTime ? errors.startTime : undefined}
              required
            />
            <TimeInput
              label="End Time"
              name="endTime"
              value={values.endTime}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.endTime ? errors.endTime : undefined}
              required
            />
            <HeadingSelect
              label="Heading"
              name="heading"
              value={values.heading}
              headings={headings}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.heading ? errors.heading : undefined}
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default WorkHoursForm;
