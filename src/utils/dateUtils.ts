export const formatDate = (dateString: string): string => {
  try {
    // Parse the date in UTC to avoid timezone issues
    const date = new Date(dateString + 'T00:00:00Z');
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    // Use a more explicit date formatting to ensure consistency
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC' // Force UTC to avoid timezone shifts
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

export const formatTime = (timeString: string): string => {
  try {
    // More strict time format validation
    if (!/^([0-1]\d|2[0-3]):[0-5]\d$/.test(timeString)) {
      throw new Error('Invalid time format');
    }

    const [hoursStr, minutesStr] = timeString.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    // Ensure two digits for minutes
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Time formatting error:', error);
    return timeString;
  }
};

export const calculateDuration = (startTime: string, endTime: string): string => {
  try {
    const [startHour, startMinute] = startTime.split(':').map(num => parseInt(num, 10));
    const [endHour, endMinute] = endTime.split(':').map(num => parseInt(num, 10));
    
    let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    
    // Handle overnight shifts
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60; // Add 24 hours worth of minutes
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  } catch (error) {
    console.error('Duration calculation error:', error);
    return 'Invalid duration';
  }
};

export const validateDateRange = (startDate: string, endDate: string): boolean => {
  try {
    // Parse dates in UTC to avoid timezone issues
    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T00:00:00Z');
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return false;
    }
    
    return start <= end;
  } catch (error) {
    console.error('Date validation error:', error);
    return false;
  }
};

export const validateTimeRange = (startTime: string, endTime: string): boolean => {
  try {
    // Stricter time format validation
    const timeRegex = /^([0-1]\d|2[0-3]):[0-5]\d$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return false;
    }

    const [startHour, startMinute] = startTime.split(':').map(num => parseInt(num, 10));
    const [endHour, endMinute] = endTime.split(':').map(num => parseInt(num, 10));
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    // Return true for any valid time range, including overnight shifts
    return startMinutes !== endMinutes;
  } catch (error) {
    console.error('Time validation error:', error);
    return false;
  }
};

export const getCurrentDate = (): string => {
  const date = new Date();
  return formatDateForInput(date);
};

export const getCurrentTime = (): string => {
  const date = new Date();
  return formatTimeForInput(date);
};

// New helper functions
export const formatDateForInput = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const formatTimeForInput = (date: Date): string => {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export const combineDateAndTime = (date: string, time: string): Date => {
  // Ensure consistent timezone handling
  return new Date(`${date}T${time}.000Z`);
};
