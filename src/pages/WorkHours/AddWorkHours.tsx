import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import WorkHoursForm from '../../components/WorkHours/WorkHoursForm';
import { useWorkHours } from '../../context/WorkHoursContext';
import type { WorkHourFormData } from '../../types';
import { getCurrentDate, getCurrentTime } from '../../utils/dateUtils';

const AddWorkHours: React.FC = () => {
  const navigate = useNavigate();
  const { addWorkHour } = useWorkHours();

  // Prevent infinite re-renders by stabilizing initial data with useState
  const [initialData] = React.useState<WorkHourFormData>(() => ({
    startDate: getCurrentDate(),
    endDate: getCurrentDate(),
    startTime: getCurrentTime(),
    endTime: getCurrentTime(),
    heading: '',
  }));

  const handleSubmit = async (data: WorkHourFormData) => {
    try {
      await addWorkHour({ ...data, isComplete: false });
      navigate('/work-hours/list', {
        state: { message: 'Work hours added successfully' },
      });
    } catch (error) {
      console.error('Failed to add work hours:', error);
      // Handle errors (e.g., show toast) if desired
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-indigo-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Work Hours</h2>
            <p className="mt-2 text-sm text-gray-500">
              Record your work hours by entering the details below
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <WorkHoursForm
          onSubmit={handleSubmit}
          initialData={initialData}
          submitLabel="Add Work Hours"
        />

        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900">Note</h4>
          <p className="mt-1 text-sm text-gray-500">
            Make sure to select the correct date range and heading for accurate
            tracking. You can edit these details later if needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddWorkHours;
