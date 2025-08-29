import React from 'react';
import type { LicenseFormData } from '../../types/license';

interface PersonalDetailsProps {
  formData: LicenseFormData;
  onInputChange: (field: keyof LicenseFormData, value: string) => void;
}

export function PersonalDetails({ formData, onInputChange }: PersonalDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sri/Smt. <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.applicantName}
            onChange={(e) => onInputChange('applicantName', e.target.value)}
            className="w-full border-b-2 border-gray-300 focus:border-green-600 outline-none py-2 text-lg transition-colors"
            placeholder="Enter applicant name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            S/o or W/o or D/o Sri/Smt. <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.parentSpouseName}
            onChange={(e) => onInputChange('parentSpouseName', e.target.value)}
            className="w-full border-b-2 border-gray-300 focus:border-green-600 outline-none py-2 text-lg transition-colors"
            placeholder="Enter parent/spouse name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Hat <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.hat}
            onChange={(e) => onInputChange('hat', e.target.value)}
            className="w-full border-b-2 border-gray-300 focus:border-green-600 outline-none py-2 text-lg transition-colors"
            placeholder="Enter Hat"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            P.O. <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.po}
            onChange={(e) => onInputChange('po', e.target.value)}
            className="w-full border-b-2 border-gray-300 focus:border-green-600 outline-none py-2 text-lg transition-colors"
            placeholder="Enter P.O."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            P.S. <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.ps}
            onChange={(e) => onInputChange('ps', e.target.value)}
            className="w-full border-b-2 border-gray-300 focus:border-green-600 outline-none py-2 text-lg transition-colors"
            placeholder="Enter P.S."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Block <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.block}
            onChange={(e) => onInputChange('block', e.target.value)}
            className="w-full border-b-2 border-gray-300 focus:border-green-600 outline-none py-2 text-lg transition-colors"
            placeholder="Enter Block"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dist.
          </label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => onInputChange('district', e.target.value)}
            className="w-full border-b-2 border-gray-300 focus:border-green-600 outline-none py-2 text-lg transition-colors bg-gray-50"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => onInputChange('state', e.target.value)}
            className="w-full border-b-2 border-gray-300 focus:border-green-600 outline-none py-2 text-lg transition-colors bg-gray-50"
            readOnly
          />
        </div>
      </div>
    </div>
  );
}