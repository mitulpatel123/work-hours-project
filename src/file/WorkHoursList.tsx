import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Filter, Clock } from 'lucide-react';
import { useWorkHours } from '../../context/WorkHoursContext';
import WorkHoursTable from '../../components/WorkHours/WorkHoursList/WorkHoursTable';

interface LocationState {
  message?: string;
}

const WorkHoursList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { workHours, deleteWorkHour, updateWorkHour } = useWorkHours();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Handle success message from navigation state
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.message) {
      setMessage(state.message);
      // Clear the message from navigation state
      window.history.replaceState({}, document.title);
      // Auto-dismiss message after 5 seconds
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

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
            <Clock className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Work Hours</h2>
              <p className="mt-1 text-sm text-gray-500">
                View and manage your work hour entries
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/work-hours/filter')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button
              type="button"
              onClick={() => navigate('/work-hours/add')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Work Hours
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

      {/* Work Hours Table */}
      <WorkHoursTable
        workHours={workHours}
        onDelete={handleDelete}
        onToggleComplete={handleToggleComplete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default WorkHoursList;