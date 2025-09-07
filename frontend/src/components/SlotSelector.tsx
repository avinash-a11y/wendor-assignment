import React from 'react';
import { Slot } from '../types';
import { formatTime, formatCurrency, cn } from '../utils';

interface SlotSelectorProps {
  slots: Slot[];
  selectedSlot: Slot | null;
  onSlotSelect: (slot: Slot) => void;
}

export function SlotSelector({ slots, selectedSlot, onSlotSelect }: SlotSelectorProps) {
  // Group slots by time for better display
  const groupedSlots = React.useMemo(() => {
    const groups: { [key: string]: Slot[] } = {};
    
    slots.forEach(slot => {
      const timeKey = slot.startTime;
      if (!groups[timeKey]) {
        groups[timeKey] = [];
      }
      groups[timeKey].push(slot);
    });

    // Sort by time
    return Object.keys(groups)
      .sort()
      .reduce((sorted, timeKey) => {
        sorted[timeKey] = groups[timeKey];
        return sorted;
      }, {} as { [key: string]: Slot[] });
  }, [slots]);

  if (Object.keys(groupedSlots).length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500">No available slots for this date</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedSlots).map(([timeKey, timeSlots]) => (
        <div key={timeKey} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">
              {formatTime(timeKey)}
            </h4>
            <span className="text-sm text-gray-500">
              {timeSlots.length} slot{timeSlots.length !== 1 ? 's' : ''} available
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {timeSlots.map((slot) => {
              const isSelected = selectedSlot?._id === slot._id;
              const isAvailable = slot.isAvailable && !slot.isBooked;

              return (
                <button
                  key={slot._id}
                  onClick={() => isAvailable && onSlotSelect(slot)}
                  disabled={!isAvailable}
                  className={cn(
                    'p-3 rounded-lg border text-left transition-all duration-200',
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : isAvailable
                      ? 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {slot.duration} minutes
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary-600">
                        {formatCurrency(slot.price)}
                      </div>
                      {!isAvailable && (
                        <div className="text-xs text-gray-400">
                          {slot.isBooked ? 'Booked' : 'Unavailable'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="mt-2 flex items-center text-sm text-primary-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
