import React from 'react';

interface LicenseTypeProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function LicenseType({ selectedType, onTypeChange }: LicenseTypeProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
        Type of License: <span className="text-red-500">*</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
            selectedType === 'commercial' 
              ? 'border-green-600 bg-green-50' 
              : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
          }`}
          onClick={() => onTypeChange('commercial')}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedType === 'commercial' 
                ? 'border-green-600 bg-green-600' 
                : 'border-gray-400'
            }`}>
              {selectedType === 'commercial' && (
                <div className="w-3 h-3 rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-lg font-medium text-gray-800">
              Commercial Only
            </span>
          </div>
        </div>

        <div 
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
            selectedType === 'commercial-residential' 
              ? 'border-green-600 bg-green-50' 
              : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
          }`}
          onClick={() => onTypeChange('commercial-residential')}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedType === 'commercial-residential' 
                ? 'border-green-600 bg-green-600' 
                : 'border-gray-400'
            }`}>
              {selectedType === 'commercial-residential' && (
                <div className="w-3 h-3 rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-lg font-medium text-gray-800">
              Commercial with Residential
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}