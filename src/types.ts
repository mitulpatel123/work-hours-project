// types.ts

export interface WorkHour {
    _id: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    heading: string | Heading;
    isComplete: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface WorkHourInput {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    heading: string;
    isComplete: boolean;
  }
  
  export interface WorkHourFormData {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    heading: string;
  }
  
  export interface Heading {
    _id: string;
    name: string;
    order: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface HeadingInput {
    name: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: {
      _id: string;
      username: string;
    };
  }
  
  export interface ValidationResponse {
    valid: boolean;
    user?: {
      _id: string;
      username: string;
    };
  }
  
  export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
  }
  
  // export interface WorkHoursContextType {
  //   workHours: WorkHour[];
  //   headings: Heading[];
  //   isLoading: boolean;
  //   error: string | null;
  //   addWorkHour: (workHour: WorkHourInput) => Promise<void>;
  //   updateWorkHour: (id: string, updates: Partial<WorkHour>) => Promise<void>;
  //   deleteWorkHour: (id: string) => Promise<void>;
  //   addHeading: (heading: HeadingInput) => Promise<void>;
  //   updateHeading: (id: string, heading: HeadingInput) => Promise<void>;
  //   deleteHeading: (id: string) => Promise<void>;
  //   reorderHeadings: (orders: { id: string; order: number }[]) => Promise<void>;
  // }


// types.ts

export interface WorkHoursContextType {
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