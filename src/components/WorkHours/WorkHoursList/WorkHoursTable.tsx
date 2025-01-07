import React from 'react';
import { Edit2, Trash2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WorkHour, Heading } from '../../../types';
import { formatDate, formatTime, calculateDuration } from '../../../utils/dateUtils';

interface WorkHoursTableProps {
  workHours: WorkHour[];
  onToggleComplete: (id: string, isComplete: boolean) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

const WorkHoursTable: React.FC<WorkHoursTableProps> = ({
  workHours,
  onToggleComplete,
  onDelete,
  isLoading = false,
}) => {
  const getHeadingName = (heading: string | Heading): string => {
    return typeof heading === 'string' ? heading : heading.name;
  };

  // Format date range for display
  const formatDateRange = (startDate: string, endDate: string): string => {
    // If start and end dates are the same, show only one date
    if (startDate === endDate) {
      return formatDate(startDate);
    }
    // Otherwise show the range
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Format time range for display
  const formatTimeRange = (startTime: string, endTime: string): string => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <Clock className="h-5 w-5 text-gray-400 animate-spin mr-2" />
        <span className="text-gray-500">Loading work hours...</span>
      </div>
    );
  }

  if (workHours.length === 0) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center text-gray-500">
        <Clock className="h-8 w-8 mb-2" />
        <p>No work hours found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Heading
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {workHours.map((workHour) => (
            <tr key={workHour._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDateRange(workHour.startDate, workHour.endDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatTimeRange(workHour.startTime, workHour.endTime)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {calculateDuration(workHour.startTime, workHour.endTime)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getHeadingName(workHour.heading)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onToggleComplete(workHour._id, !workHour.isComplete)}
                  className={`inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                    workHour.isComplete
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  }`}
                >
                  {workHour.isComplete ? 'Completed' : 'Pending'}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-3">
                  <Link 
                    to={`/work-hours/edit/${workHour._id}`} 
                    className="text-indigo-600 hover:text-indigo-900"
                    aria-label="Edit work hours"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  {onDelete && (
                    <button 
                      onClick={() => onDelete(workHour._id)} 
                      className="text-red-600 hover:text-red-900"
                      aria-label="Delete work hours"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkHoursTable;
