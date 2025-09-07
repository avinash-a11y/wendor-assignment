import React from 'react';
import { formatDate, isToday, isPast, cn } from '../utils';

interface DateSelectorProps {
  dates: Date[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DateSelector({ dates, selectedDate, onDateSelect }: DateSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
      {dates.map((date) => {
        const isSelected = selectedDate.toDateString() === date.toDateString();
        const isTodayDate = isToday(date);
        const isPastDate = isPast(date);

        return (
          <button
            key={date.toISOString()}
            onClick={() => !isPastDate && onDateSelect(date)}
            disabled={isPastDate}
            className={cn(
              'p-3 rounded-lg border text-center transition-all duration-200',
              isSelected
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : isPastDate
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            <div className="text-xs font-medium text-gray-500 mb-1">
              {formatDate(date, 'EEE')}
            </div>
            <div className="text-lg font-semibold">
              {formatDate(date, 'd')}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(date, 'MMM')}
            </div>
            {isTodayDate && (
              <div className="mt-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Today
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
