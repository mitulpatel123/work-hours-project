import React, { useState } from 'react';
import { Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkHours } from '../../context/WorkHoursContext';
import WorkHoursTable from '../../components/WorkHours/WorkHoursList/WorkHoursTable';
import DateInput from '../../components/Forms/DateInput';
import HeadingSelect from '../../components/Forms/HeadingSelect';
import type { WorkHour } from '../../types';
import { validateDateRange } from '../../utils/dateUtils';

interface FilterCriteria {
  startDate: string;
  endDate: string;
  heading: string;
  status: 'all' | 'complete' | 'pending';
}

const RATE_PER_MINUTE = 0.2; // $0.2 per minute

const FilterWorkHours: React.FC = () => {
  const navigate = useNavigate();
  const { workHours, headings, deleteWorkHour, updateWorkHour } = useWorkHours();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterCriteria>({
    startDate: '',
    endDate: '',
    heading: '',
    status: 'all',
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      if (name === 'startDate' && !value) {
        newFilters.endDate = '';
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      heading: '',
      status: 'all',
    });
  };

  const filterWorkHours = (workHours: WorkHour[]): WorkHour[] => {
    return workHours.filter((wh) => {
      // Date range filter
      if (filters.startDate && filters.endDate) {
        const isWithinRange = validateDateRange(filters.startDate, wh.startDate) &&
                            validateDateRange(wh.endDate, filters.endDate);
        if (!isWithinRange) return false;
      } else if (filters.startDate && !validateDateRange(filters.startDate, wh.startDate)) {
        return false;
      } else if (filters.endDate && !validateDateRange(wh.endDate, filters.endDate)) {
        return false;
      }

      // Heading filter
      if (filters.heading) {
        const headingId = typeof wh.heading === 'string' ? wh.heading : wh.heading._id;
        if (headingId !== filters.heading) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all') {
        if (filters.status === 'complete' && !wh.isComplete) return false;
        if (filters.status === 'pending' && wh.isComplete) return false;
      }

      return true;
    });
  };

  const calculateTotalMinutesAndEarnings = (filteredHours: WorkHour[]) => {
    let totalMinutes = 0;

    filteredHours.forEach((wh) => {
      const [startHour, startMinute] = wh.startTime.split(':').map(Number);
      const [endHour, endMinute] = wh.endTime.split(':').map(Number);
      
      let minutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
      
      // Handle overnight shifts
      if (minutes < 0) {
        minutes += 24 * 60; // Add 24 hours worth of minutes
      }
      
      totalMinutes += minutes;
    });

    const earnings = totalMinutes * RATE_PER_MINUTE;

    return {
      totalMinutes,
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      earnings: earnings.toFixed(2)
    };
  };

  // Sort and calculate totals
  const { sortedAndFilteredWorkHours, totals } = React.useMemo(() => {
    const filtered = filterWorkHours(workHours);
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(`${a.startDate}T${a.startTime}`);
      const dateB = new Date(`${b.startDate}T${b.startTime}`);
      return dateB.getTime() - dateA.getTime();
    });

    return {
      sortedAndFilteredWorkHours: sorted,
      totals: calculateTotalMinutesAndEarnings(sorted)
    };
  }, [workHours, filters]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work hour entry?')) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteWorkHour(id);
      setMessage('Work hour entry deleted successfully');
    } catch (error) {
      console.error('Failed to delete work hour:', error);
      setMessage('Failed to delete work hour entry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (id: string, isComplete: boolean) => {
    setIsLoading(true);
    try {
      await updateWorkHour(id, { isComplete });
      setMessage(`Work hour marked as ${isComplete ? 'complete' : 'pending'}`);
    } catch (error) {
      console.error('Failed to update work hour:', error);
      setMessage('Failed to update work hour status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Filter Work Hours
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Apply filters to find specific work hour entries
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
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            <DateInput
              label="Start Date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <DateInput
              label="End Date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              min={filters.startDate}
              disabled={!filters.startDate}
            />
            <HeadingSelect
              label="Heading"
              name="heading"
              value={filters.heading}
              headings={headings}
              onChange={handleFilterChange}
              placeholder="All Headings"
            />
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="complete">Complete</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-semibold text-gray-900"
          >
            Reset Filters
          </button>
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

      {/* Results Count and Summary */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Filtered Entries</p>
            <p className="text-2xl font-semibold text-gray-900">
              {sortedAndFilteredWorkHours.length} of {workHours.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Time</p>
            <p className="text-2xl font-semibold text-gray-900">
              {totals.hours}h {totals.minutes}m
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Minutes</p>
            <p className="text-2xl font-semibold text-gray-900">
              {totals.totalMinutes}m
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Earnings ($0.2/min)</p>
            <p className="text-2xl font-semibold text-indigo-600">
              ${totals.earnings}
            </p>
          </div>
        </div>
      </div>

      {/* Work Hours Table */}
      <WorkHoursTable
        workHours={sortedAndFilteredWorkHours}
        onDelete={handleDelete}
        onToggleComplete={handleToggleComplete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default FilterWorkHours;
