export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString; // Return original string if formatting fails
  }
};

export const formatTime = (timeString: string): string => {
  try {
    // Check if timeString matches HH:mm format
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
      throw new Error('Invalid time format');
    }
    
    // Convert to 12-hour format
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Time formatting error:', error);
    return timeString; // Return original string if formatting fails
  }
};

export const calculateDuration = (startTime: string, endTime: string): string => {
  try {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let hours = endHour - startHour;
    let minutes = endMinute - startMinute;

    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }

    if (hours < 0) {
      hours += 24; // Handle overnight shifts
    }

    return `${hours}h ${Math.abs(minutes)}m`;
  } catch (error) {
    console.error('Duration calculation error:', error);
    return 'Invalid duration';
  }
};

export const validateDateRange = (startDate: string, endDate: string): boolean => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return false;
    }
    
    // Reset time part for date comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    return start <= end;
  } catch (error) {
    console.error('Date validation error:', error);
    return false;
  }
};

export const validateTimeRange = (startTime: string, endTime: string): boolean => {
  try {
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(startTime) || 
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(endTime)) {
      return false;
    }

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return endMinutes > startMinutes;
  } catch (error) {
    console.error('Time validation error:', error);
    return false;
  }
};

export const getCurrentDate = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

export const getCurrentTime = (): string => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};