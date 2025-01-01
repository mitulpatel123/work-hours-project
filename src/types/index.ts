// Context Types
export interface AuthContextType {
  isAuthenticated: boolean;
  login: (pin: string) => Promise<void>;
  logout: () => void;
  resetInactivityTimer: () => void;
}

export interface WorkHoursContextType {
  workHours: WorkHour[];
  headings: Heading[];
  isLoading: boolean;
  error: string | null;
  addWorkHour: (workHour: WorkHourInput) => Promise<void>;
  updateWorkHour: (id: string, updates: Partial<WorkHour>) => Promise<void>;
  deleteWorkHour: (id: string) => Promise<void>;
  addHeading: (name: string) => Promise<void>;
  updateHeading: (id: string, name: string) => Promise<void>;
  deleteHeading: (id: string) => Promise<void>;
  reorderHeadings: (orders: HeadingOrder[]) => Promise<void>;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    lastLogin: string | null;
    createdAt: string;
  };
}

export interface ValidationResponse {
  valid: boolean;
  user?: {
    _id: string;
    lastLogin: string | null;
    createdAt: string;
  };
}

// Model Types
export interface WorkHour {
  _id: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  heading: string | Heading;
  isComplete: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkHourInput {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  heading: string;
  isComplete?: boolean;
}

export interface Heading {
  _id: string;
  name: string;
  order: number;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeadingInput {
  name: string;
  order?: number;
}

export interface HeadingOrder {
  id: string;
  order: number;
}

// Form Types
export interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Router Types
export interface LocationState {
  message?: string;
}

// Component Props Types
export interface DateInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

export interface TimeInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

export interface HeadingSelectProps {
  label: string;
  name: string;
  value: string;
  headings: Heading[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}