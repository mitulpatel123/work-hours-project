import axios, { AxiosError, AxiosResponse } from 'axios';
import type { 
  WorkHour, 
  Heading, 
  LoginResponse, 
  ValidationResponse,
  ApiResponse,
  WorkHourInput,
  HeadingInput
} from '../types';

// Define error response type
interface ApiErrorResponse {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mitul.shop/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }

    // Handle network errors
    if (!error.response) {
      throw new Error('Network error occurred. Please check your connection.');
    }

    // Handle specific error responses
    const errorMessage = error.response.data?.message || 'An error occurred';
    throw new Error(errorMessage);
  }
);

// Auth API
export const authApi = {
  login: async (pin: string): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', { pin });
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  },

  validateToken: async (): Promise<ApiResponse<ValidationResponse>> => {
    try {
      const response = await api.get<ValidationResponse>('/auth/validate');
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Token validation failed' 
      };
    }
  },

  changePin: async (currentPin: string, newPin: string): Promise<ApiResponse<void>> => {
    try {
      await api.post('/auth/change-pin', { currentPin, newPin });
      return { data: undefined, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to change PIN' 
      };
    }
  }
};

// Work Hours API
export const workHoursApi = {
  getAll: async (): Promise<ApiResponse<WorkHour[]>> => {
    try {
      const response = await api.get<WorkHour[]>('/work-hours');
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to fetch work hours' 
      };
    }
  },

  create: async (workHour: WorkHourInput): Promise<ApiResponse<WorkHour>> => {
    try {
      const response = await api.post<WorkHour>('/work-hours', workHour);
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to create work hour' 
      };
    }
  },

  update: async (id: string, updates: Partial<WorkHour>): Promise<ApiResponse<WorkHour>> => {
    try {
      const response = await api.put<WorkHour>(`/work-hours/${id}`, updates);
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to update work hour' 
      };
    }
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`/work-hours/${id}`);
      return { data: undefined, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to delete work hour' 
      };
    }
  },

  updateStatus: async (filters: {
    startDate?: string;
    endDate?: string;
    heading?: string;
    isComplete: boolean;
  }): Promise<ApiResponse<{ modifiedCount: number }>> => {
    try {
      const response = await api.put<{ modifiedCount: number }>(
        '/work-hours/status/batch', 
        filters
      );
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to update status' 
      };
    }
  }
};

// Headings API
export const headingsApi = {
  getAll: async (): Promise<ApiResponse<Heading[]>> => {
    try {
      const response = await api.get<Heading[]>('/headings');
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to fetch headings' 
      };
    }
  },

  create: async (heading: HeadingInput): Promise<ApiResponse<Heading>> => {
    try {
      const response = await api.post<Heading>('/headings', heading);
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to create heading' 
      };
    }
  },

  update: async (id: string, updates: HeadingInput): Promise<ApiResponse<Heading>> => {
    try {
      const response = await api.put<Heading>(`/headings/${id}`, updates);
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to update heading' 
      };
    }
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`/headings/${id}`);
      return { data: undefined, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to delete heading' 
      };
    }
  },

  reorder: async (orders: { id: string; order: number }[]): Promise<ApiResponse<void>> => {
    try {
      await api.put('/headings/reorder', { orders });
      return { data: undefined, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to reorder headings' 
      };
    }
  }
};

export default api;
