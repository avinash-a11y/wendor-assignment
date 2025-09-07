import React from 'react';
import { ServiceTypeOption } from '../types';
import { getServiceTypeIcon, cn } from '../utils';

interface ServiceTypeFilterProps {
  serviceTypes: ServiceTypeOption[];
  selectedServiceType: string;
  onServiceTypeChange: (serviceType: string) => void;
}

export function ServiceTypeFilter({
  serviceTypes,
  selectedServiceType,
  onServiceTypeChange,
}: ServiceTypeFilterProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {serviceTypes.map((serviceType) => (
        <button
          key={serviceType.value}
          onClick={() => onServiceTypeChange(serviceType.value)}
          className={cn(
            'p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md',
            selectedServiceType === serviceType.value
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          )}
        >
          <div className="text-center">
            <div className="text-3xl mb-2">
              {serviceType.icon}
            </div>
            <div className="font-medium text-sm">
              {serviceType.label}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
