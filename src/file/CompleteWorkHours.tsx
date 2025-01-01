import React, { useState } from 'react';
import { CheckSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkHours } from '../../context/WorkHoursContext';
import DateInput from '../../components/Forms/DateInput';
import HeadingSelect from '../../components/Forms/HeadingSelect';
import WorkHoursTable from '../../components/WorkHours/WorkHoursList/WorkHoursTable';
import { validateDateRange } from '../../utils/dateUtils';
import type { WorkHour } from '../../types';

interface BatchFilters {
  startDate: string;
  endDate: string;
  heading: string;
}

const CompleteWorkHours: React.FC = () => {
  const navigate = useNavigate();
  const { workHours, headings, updateWorkHour } = useWorkHours();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<BatchFilters>({
    startDate: '',
    endDate: '',
    heading: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredWorkHours: WorkHour[] = workHours.filter(wh => {
    if (filters.startDate && wh.startDate < filters.startDate) return false;
    if (filters.endDate && wh.endDate > filters.endDate) return false;
    if (filters.heading && 
        (typeof wh.heading === 'string' ? wh.heading : wh.heading._id) !== filters.heading) {
      return false;
    }
    return true;
  });

  const handleMarkComplete = async (complete: boolean) => {
    // Validate date range if both dates are provided
    if (filters.startDate && filters.endDate) {
      if (!validateDateRange(filters.startDate, filters.endDate)) {
        setMessage('End date must be after or equal to start date');
        return;
      }
    }

    setIsLoading(true);
    try {
      await Promise.all(
        filteredWorkHours.map(wh => 
          updateWorkHour(wh._id, { isComplete: complete })
        )
      );

      const updatedCount = filteredWorkHours.length;
      setMessage(
        `Successfully marked ${updatedCount} work hour ${updatedCount === 1 ? 'entry' : 'entries'} as ${complete ? 'complete' : 'incomplete'}`
      );
    } catch (error) {
      console.error('Failed to update work hours:', error);
      setMessage('Failed to update work hours');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (id: string, isComplete: boolean) => {
    setIsLoading(true);
    try {
      await updateWorkHour(id, { isComplete });
      setMessage(`Work hour marked as ${isComplete ? 'complete' : 'incomplete'}`);
    } catch (error) {
      console.error('Failed to update work hour:', error);
      setMessage('Failed to update work hour status');
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      heading: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckSquare className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mark Work Hours Complete</h2>
              <p className="mt-1 text-sm text-gray-500">
                Update the completion status of multiple work hour entries
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/work-hours/list')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to List
          </button>
        </div>
      </div>

      {/* Filter Form */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <DateInput
                label="Start Date"
                name="startDate"
                value={filters.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="sm:col-span-1">
              <DateInput
                label="End Date"
                name="endDate"
                value={filters.endDate}
                onChange={handleInputChange}
                min={filters.startDate}
              />
            </div>
            <div className="sm:col-span-1">
              <HeadingSelect
                label="Heading"
                name="heading"
                value={filters.heading}
                headings={headings}
                onChange={handleInputChange}
                placeholder="All Headings"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-semibold text-gray-900"
          >
            Reset Filters
          </button>
          <div className="flex gap-x-3">
            <button
              type="button"
              onClick={() => handleMarkComplete(false)}
              disabled={isLoading || filteredWorkHours.length === 0}
              className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              Mark as Incomplete
            </button>
            <button
              type="button"
              onClick={() => handleMarkComplete(true)}
              disabled={isLoading || filteredWorkHours.length === 0}
              className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              Mark as Complete
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div 
          className={`rounded-md p-4 ${
            message.includes('Failed') 
              ? 'bg-red-50 text-red-800' 
              : 'bg-green-50 text-green-800'
          }`}
        >
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {filteredWorkHours.length} of {workHours.length} entries
      </div>

      {/* Work Hours Table */}
      <WorkHoursTable
        workHours={filteredWorkHours}
        onToggleComplete={handleToggleComplete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CompleteWorkHours;