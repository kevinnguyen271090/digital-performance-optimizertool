import { useState } from 'react';
import { DEFAULT_DATE_RANGE, DATE_RANGE_OPTIONS } from '../constants/dashboard';

export const useDateRange = () => {
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [dateRangeString, setDateRangeString] = useState('30 ngày qua');

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({ startDate, endDate });
    
    // Calculate date range string
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff === 0) {
      setDateRangeString(DATE_RANGE_OPTIONS.today);
    } else if (daysDiff === 1) {
      setDateRangeString(DATE_RANGE_OPTIONS.yesterday);
    } else if (daysDiff === 7) {
      setDateRangeString(DATE_RANGE_OPTIONS.last7Days);
    } else if (daysDiff === 30) {
      setDateRangeString(DATE_RANGE_OPTIONS.last30Days);
    } else if (daysDiff === 90) {
      setDateRangeString(DATE_RANGE_OPTIONS.last90Days);
    } else {
      setDateRangeString(`${daysDiff} ngày`);
    }
  };

  return {
    dateRange,
    dateRangeString,
    handleDateRangeChange
  };
}; 