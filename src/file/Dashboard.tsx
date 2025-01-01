import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Plus, List, Filter, CheckSquare } from 'lucide-react';
import { useWorkHours } from '../context/WorkHoursContext';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentWorkHours from '../components/Dashboard/RecentWorkHours';

const Dashboard: React.FC = () => {
  const { workHours } = useWorkHours();

  const stats = useMemo(() => {
    const total = workHours.length;
    const completed = workHours.filter(wh => wh.isComplete).length;
    const pending = total - completed;
    
    // Calculate completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Calculate month-over-month growth
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const thisMonthEntries = workHours.filter(wh => {
      const date = new Date(wh.startDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    const lastMonthEntries = workHours.filter(wh => {
      const date = new Date(wh.startDate);
      const isLastMonth = currentMonth === 0 
        ? date.getMonth() === 11 && date.getFullYear() === currentYear - 1
        : date.getMonth() === currentMonth - 1 && date.getFullYear() === currentYear;
      return isLastMonth;
    }).length;

    const monthlyGrowth = lastMonthEntries > 0 
      ? Math.round(((thisMonthEntries - lastMonthEntries) / lastMonthEntries) * 100)
      : 0;

    // Calculate average duration
    let totalMinutes = 0;
    workHours.forEach(wh => {
      const [startHour, startMinute] = wh.startTime.split(':').map(Number);
      const [endHour, endMinute] = wh.endTime.split(':').map(Number);
      let minutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
      if (minutes < 0) minutes += 24 * 60; // Handle overnight shifts
      totalMinutes += minutes;
    });
    const averageDuration = total > 0 ? Math.round(totalMinutes / total) : 0;
    const averageHours = Math.floor(averageDuration / 60);
    const averageMinutes = averageDuration % 60;

    return {
      total,
      completed,
      pending,
      completionRate,
      monthlyGrowth,
      averageDuration: `${averageHours}h ${averageMinutes}m`
    };
  }, [workHours]);

  const quickActions = [
    { 
      icon: Plus, 
      label: 'Add Work Hours', 
      path: '/work-hours/add',
      description: 'Record new work hours',
      color: 'bg-indigo-600 hover:bg-indigo-700 text-white'
    },
    { 
      icon: List, 
      label: 'View All', 
      path: '/work-hours/list',
      description: 'See all work hour entries',
      color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
    },
    { 
      icon: Filter, 
      label: 'Filter Hours', 
      path: '/work-hours/filter',
      description: 'Search and filter entries',
      color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
    },
    { 
      icon: CheckSquare, 
      label: 'Mark Complete', 
      path: '/work-hours/complete',
      description: 'Update completion status',
      color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
          Dashboard
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Overview of your work hours and recent activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Work Hours"
          value={stats.total}
          icon={Clock}
          color="blue"
          trend={stats.monthlyGrowth !== 0 ? {
            value: Math.abs(stats.monthlyGrowth),
            isPositive: stats.monthlyGrowth > 0
          } : undefined}
          description="Total number of work hour entries"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckSquare}
          color="green"
          description={`${stats.completionRate}% completion rate`}
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={List}
          color="yellow"
          description="Work hours pending completion"
        />
        <StatsCard
          title="Average Duration"
          value={stats.averageDuration}
          icon={Clock}
          color="blue"
          description="Average time per entry"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className={`${action.color} shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-center">
              <action.icon className="h-6 w-6 flex-shrink-0" />
              <div className="ml-4">
                <p className={`text-sm font-medium ${
                  action.color.includes('white') ? 'text-gray-900' : 'text-white'
                }`}>
                  {action.label}
                </p>
                <p className={`mt-1 text-sm ${
                  action.color.includes('white') ? 'text-gray-500' : 'text-white/80'
                }`}>
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Work Hours */}
      <RecentWorkHours limit={5} />
    </div>
  );
};

export default Dashboard;