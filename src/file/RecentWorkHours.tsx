import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Plus } from 'lucide-react';
import { useWorkHours } from '../../context/WorkHoursContext';
import { formatDate, formatTime, calculateDuration } from '../../utils/dateUtils';
import type { WorkHour, Heading } from '../../types';

interface Props {
  limit?: number;
  isLoading?: boolean;
}

const RecentWorkHours: React.FC<Props> = ({ limit = 5, isLoading = false }) => {
  const { workHours } = useWorkHours();

  const recentWorkHours = React.useMemo(() => {
    return [...workHours]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [workHours, limit]);

  const getHeadingName = (heading: string | Heading): string => {
    return typeof heading === 'string' ? heading : heading.name;
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg" data-testid="recent-work-hours-skeleton">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Recent Work Hours
          </h3>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse flex items-center justify-between"
              >
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recentWorkHours.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No work hours recorded
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by recording your first work hours entry.
            </p>
            <div className="mt-6">
              <Link
                to="/work-hours/add"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Work Hours
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Work Hours
          </h3>
          <Link
            to="/work-hours/list"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 inline-flex items-center"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {recentWorkHours.map((workHour) => (
              <li key={workHour._id} className="py-4" data-testid="work-hour-item">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-3">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {getHeadingName(workHour.heading)}
                      </p>
                      <span
                        className={`inline-flex flex-shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          workHour.isComplete
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {workHour.isComplete ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-3">
                      <p className="truncate text-sm text-gray-500">
                        {formatDate(workHour.startDate)}
                        {workHour.startDate !== workHour.endDate && (
                          <> - {formatDate(workHour.endDate)}</>
                        )}
                      </p>
                      <span className="text-gray-300">·</span>
                      <p className="text-sm text-gray-500">
                        {formatTime(workHour.startTime)} - {formatTime(workHour.endTime)}
                      </p>
                    </div>
                  </div>
                  <div className="ml-6 flex-shrink-0">
                    <span 
                      className="inline-block text-sm font-medium text-gray-900"
                      data-testid="work-hour-duration"
                    >
                      {calculateDuration(workHour.startTime, workHour.endTime)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecentWorkHours;