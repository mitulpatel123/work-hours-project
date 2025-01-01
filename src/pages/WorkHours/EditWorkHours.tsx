import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';
import WorkHoursForm from '../../components/WorkHours/WorkHoursForm';
import { useWorkHours } from '../../context/WorkHoursContext';
import type { WorkHourFormData } from '../../types';

const EditWorkHours: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workHours, updateWorkHour } = useWorkHours();

  // Find existing work-hour entry
  const workHour = workHours.find((wh) => wh._id === id);

  if (!workHour) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <h2 className="text-xl text-gray-900 mb-4">Work hour entry not found</h2>
        <button
          onClick={() => navigate('/work-hours/list')}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Work Hours List
        </button>
      </div>
    );
  }

  // Stabilize initial form data so it doesn't cause infinite re-renders
  const [initialData] = React.useState<WorkHourFormData>(() => ({
    startDate: workHour.startDate,
    endDate: workHour.endDate,
    startTime: workHour.startTime,
    endTime: workHour.endTime,
    heading:
      typeof workHour.heading === 'string'
        ? workHour.heading
        : workHour.heading._id,
  }));

  const handleSubmit = async (data: WorkHourFormData) => {
    try {
      await updateWorkHour(id!, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      navigate('/work-hours/list', {
        state: { message: 'Work hours updated successfully' },
      });
    } catch (error) {
      console.error('Failed to update work hours:', error);
      // Handle errors (e.g., show toast) if desired
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Work Hours</h2>
              <p className="mt-2 text-sm text-gray-500">
                Modify the work hours entry details below
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/work-hours/list')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to List
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <WorkHoursForm
          onSubmit={handleSubmit}
          initialData={initialData}
          submitLabel="Update Work Hours"
        />
      </div>
    </div>
  );
};

export default EditWorkHours;
