import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red';
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = 'blue',
  isLoading = false
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-500',
          light: 'bg-green-50 text-green-700',
          text: 'text-green-600'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-500',
          light: 'bg-yellow-50 text-yellow-700',
          text: 'text-yellow-600'
        };
      case 'red':
        return {
          bg: 'bg-red-500',
          light: 'bg-red-50 text-red-700',
          text: 'text-red-600'
        };
      default:
        return {
          bg: 'bg-indigo-500',
          light: 'bg-indigo-50 text-indigo-700',
          text: 'text-indigo-600'
        };
    }
  };

  const colors = getColorClasses();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-5 animate-pulse">
        <div className="flex items-center">
          <div className={`rounded-md p-3 ${colors.light}`}>
            <div className="h-6 w-6 bg-gray-200 rounded" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="mt-2 h-6 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`rounded-md p-3 ${colors.bg}`}>
            <Icon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {trend && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.isPositive ? '↑' : '↓'}
                    {trend.value}%
                  </div>
                )}
              </dd>
              {description && (
                <dd className="mt-1 text-sm text-gray-500">
                  {description}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;