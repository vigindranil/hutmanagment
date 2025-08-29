import React, { useState } from 'react';
import { FormHeader } from './FormHeader';
import { PersonalDetails } from './PersonalDetails';
import { LicenseType } from './LicenseType';
import { TermsAndConditions } from './TermsAndConditions.tsx';
import { FormActions } from './FormActions';
import type { LicenseFormData } from '../../types/license';

export function LicenseForm() {
  const [formData, setFormData] = useState<LicenseFormData>({
    licenseNumber: '',
    applicantName: '',
    parentSpouseName: '',
    hat: '',
    po: '',
    ps: '',
    block: '',
    district: 'Jalpaiguri',
    state: 'West Bengal',
    licenseType: ''
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions before submitting.');
      return;
    }
    console.log('Form submitted:', formData);
    alert('License application submitted successfully!');
  };

  const handleInputChange = (field: keyof LicenseFormData, value: string) => {
    setFormData((prev: LicenseFormData) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <FormHeader />
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <PersonalDetails 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
          
          <LicenseType 
            selectedType={formData.licenseType}
            onTypeChange={(type) => handleInputChange('licenseType', type)}
          />
          
          <TermsAndConditions 
            agreed={agreedToTerms}
            onAgreementChange={setAgreedToTerms}
          />
          
          <FormActions />
        </form>
      </div>
    </div>
  );
}