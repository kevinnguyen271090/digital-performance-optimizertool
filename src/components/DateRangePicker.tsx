import React, { useState } from "react";
// @ts-ignore
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { vi } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

interface DateRangePickerProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  defaultRange?: "last30days" | "last7days" | "today" | "yesterday";
}

const presets = [
  { label: "Hôm nay", range: () => {
    const today = new Date();
    return { startDate: today, endDate: today };
  } },
  { label: "Hôm qua", range: () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return { startDate: yesterday, endDate: yesterday };
  } },
  { label: "7 ngày qua", range: () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    return { startDate: start, endDate: end };
  } },
  { label: "30 ngày qua", range: () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);
    return { startDate: start, endDate: end };
  } },
];

function formatDate(date: Date) {
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateRangeChange, defaultRange = "last30days" }) => {
  const { t } = useTranslation();
  const defaultPreset = presets.find(p => p.label === "30 ngày qua") || presets[2];
  const [range, setRange] = useState({
    startDate: defaultPreset.range().startDate,
    endDate: defaultPreset.range().endDate,
    key: "selection"
  });
  const [show, setShow] = useState(false);
  const [activePreset, setActivePreset] = useState("30 ngày qua");

  const handleSelect = (ranges: RangeKeyDict) => {
    setRange(ranges.selection as any);
    setActivePreset(""); // bỏ highlight preset khi chọn custom
  };

  const handleApply = () => {
    setShow(false);
    onDateRangeChange(range.startDate, range.endDate);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t('date.range_picker', 'Chọn khoảng thời gian')}
      </label>
      <button
        onClick={() => setShow(!show)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
      >
        <span>
          {range.startDate && range.endDate
            ? `${format(range.startDate, 'dd/MM/yyyy')} - ${format(range.endDate, 'dd/MM/yyyy')}`
            : t('date.select_range', 'Chọn khoảng thời gian')}
        </span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </button>

      {show && (
        <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('date.start_date', 'Từ ngày')}
                </label>
                <input
                  type="date"
                  value={format(range.startDate, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setRange({ ...range, startDate: newDate });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('date.end_date', 'Đến ngày')}
                </label>
                <input
                  type="date"
                  value={format(range.endDate, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setRange({ ...range, endDate: newDate });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShow(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                {t('button.cancel', 'Hủy')}
              </button>
              <button
                onClick={handleApply}
                className="px-3 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-accent/90 transition"
              >
                {t('button.apply', 'Áp dụng')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
