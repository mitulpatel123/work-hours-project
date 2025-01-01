import React, { createContext, useContext, useEffect, useState } from 'react';
import { workHoursApi, headingsApi } from '../services/api';
import { WorkHour, Heading, WorkHourInput, HeadingInput } from '../types';
import { useAuth } from './AuthContext';

// Define the context type inline to ensure consistency
interface WorkHoursContextType {
  workHours: WorkHour[];
  headings: Heading[];
  isLoading: boolean;
  error: string | null;
  addWorkHour: (workHour: WorkHourInput) => Promise<void>;
  updateWorkHour: (id: string, updates: Partial<WorkHour>) => Promise<void>;
  deleteWorkHour: (id: string) => Promise<void>;
  addHeading: (heading: HeadingInput) => Promise<void>;
  updateHeading: (id: string, heading: HeadingInput) => Promise<void>;
  deleteHeading: (id: string) => Promise<void>;
  reorderHeadings: (orders: { id: string; order: number }[]) => Promise<void>;
}

const WorkHoursContext = createContext<WorkHoursContextType | null>(null);

export const WorkHoursProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      
      try {
        const [workHoursRes, headingsRes] = await Promise.all([
          workHoursApi.getAll(),
          headingsApi.getAll()
        ]);
        
        if (workHoursRes.data) {
          setWorkHours(workHoursRes.data);
        }
        if (headingsRes.data) {
          setHeadings(headingsRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const addWorkHour = async (workHour: WorkHourInput): Promise<void> => {
    try {
      const response = await workHoursApi.create(workHour);
      if (response.data) {
        setWorkHours(prev => [...prev, response.data as WorkHour]);
      } else {
        throw new Error('Failed to add work hour');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to add work hour');
    }
  };

  const updateWorkHour = async (id: string, updates: Partial<WorkHour>): Promise<void> => {
    try {
      const response = await workHoursApi.update(id, updates);
      if (response.data) {
        setWorkHours(prev => 
          prev.map(wh => wh._id === id ? response.data as WorkHour : wh)
        );
      } else {
        throw new Error('Failed to update work hour');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update work hour');
    }
  };

  const deleteWorkHour = async (id: string): Promise<void> => {
    try {
      const response = await workHoursApi.delete(id);
      if (!response.error) {
        setWorkHours(prev => prev.filter(wh => wh._id !== id));
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete work hour');
    }
  };

  const addHeading = async (heading: HeadingInput): Promise<void> => {
    try {
      const response = await headingsApi.create(heading);
      if (response.data) {
        setHeadings(prev => [...prev, response.data as Heading]);
      } else {
        throw new Error('Failed to add heading');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to add heading');
    }
  };

  const updateHeading = async (id: string, heading: HeadingInput): Promise<void> => {
    try {
      const response = await headingsApi.update(id, heading);
      if (response.data) {
        setHeadings(prev => 
          prev.map(h => h._id === id ? response.data as Heading : h)
        );
      } else {
        throw new Error('Failed to update heading');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update heading');
    }
  };

  const deleteHeading = async (id: string): Promise<void> => {
    try {
      const response = await headingsApi.delete(id);
      if (!response.error) {
        setHeadings(prev => prev.filter(h => h._id !== id));
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete heading');
    }
  };

  const reorderHeadings = async (orders: { id: string; order: number }[]): Promise<void> => {
    try {
      const response = await headingsApi.reorder(orders);
      if (response.error) {
        throw new Error(response.error);
      }

      // Refetch headings after reordering
      const headingsRes = await headingsApi.getAll();
      if (headingsRes.data) {
        setHeadings(headingsRes.data);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to reorder headings');
    }
  };

  return (
    <WorkHoursContext.Provider
      value={{
        workHours,
        headings,
        isLoading,
        error,
        addWorkHour,
        updateWorkHour,
        deleteWorkHour,
        addHeading,
        updateHeading,
        deleteHeading,
        reorderHeadings
      }}
    >
      {children}
    </WorkHoursContext.Provider>
  );
};

export const useWorkHours = () => {
  const context = useContext(WorkHoursContext);
  if (!context) {
    throw new Error('useWorkHours must be used within a WorkHoursProvider');
  }
  return context;
};