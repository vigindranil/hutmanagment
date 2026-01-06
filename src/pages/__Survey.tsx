import React, { useState } from 'react';
import { 
  ClipboardList, 
  User, 
  Building, 
  MapPin, 
  Phone, 
  Mail,
  Camera,
  Save,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Navigation,
  Ruler,
  IndianRupee,
  Calendar,
  FileText,
  Upload,
  Sparkles
} from 'lucide-react';

const Survey: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    ownerName: '',
    fatherName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    aadharNumber: '',
    panNumber: '',
    
    // Business Information
    businessName: '',
    businessType: '',
    category: '',
    establishmentYear: '',
    gstNumber: '',
    
    // Shop Details
    shopType: '',
    shopArea: '',
    shopLength: '',
    shopWidth: '',
    monthlyRent: '',
    
    // Location Information (Hierarchical)
    district: '',
    block: '',
    gramPanchayat: '',
    village: '',
    address: '',
    landmark: '',
    pincode: '',
    ward: '',
    marketComplex: '',
    gpsLatitude: '',
    gpsLongitude: '',
    
    // Additional Information
    employeeCount: '',
    averageMonthlyIncome: '',
    previousTaxPaid: '',
    notes: ''
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Address hierarchy data
  const districts = [
    'Jalpaiguri',
    'Cooch Behar',
    'Alipurduar',
    'Darjeeling'
  ];

  const blocks = {
    'Jalpaiguri': ['Jalpaiguri Sadar', 'Rajganj', 'Maynaguri', 'Dhupguri', 'Kranti', 'Nagrakata'],
    'Cooch Behar': ['Cooch Behar I', 'Cooch Behar II', 'Mathabhanga I', 'Mathabhanga II'],
    'Alipurduar': ['Alipurduar I', 'Alipurduar II', 'Kumargram', 'Kalchini'],
    'Darjeeling': ['Darjeeling Sadar', 'Kurseong', 'Mirik', 'Kharibari']
  };

  const gramPanchayats = {
    'Jalpaiguri Sadar': ['Binnaguri', 'Paharpur', 'Rajadanga', 'Sukani'],
    'Rajganj': ['Rajganj', 'Belakoba', 'Ambari Falakata', 'Shikarpur'],
    'Maynaguri': ['Maynaguri', 'Damdim', 'Lataguri', 'Salkumar'],
    'Dhupguri': ['Dhupguri', 'Newlands', 'Raipur', 'Birpara']
  };

  const villages = {
    'Binnaguri': ['Binnaguri Bazar', 'Binnaguri Tea Garden', 'Binnaguri Station'],
    'Paharpur': ['Paharpur Bazar', 'Paharpur Colony', 'Paharpur Village'],
    'Rajadanga': ['Rajadanga Bazar', 'Rajadanga Para', 'Rajadanga Station'],
    'Sukani': ['Sukani Bazar', 'Sukani Village', 'Sukani Colony']
  };

  const businessCategories = [
    'Grocery & General Store',
    'Clothing & Textiles',
    'Electronics & Mobile',
    'Food & Beverages',
    'Medical & Pharmacy',
    'Hardware & Tools',
    'Jewelry & Accessories',
    'Books & Stationery',
    'Footwear & Leather',
    'Cosmetics & Beauty',
    'Automobile Parts',
    'Other'
  ];

  const shopTypes = [
    'Permanent Structure',
    'Semi-Permanent Structure',
    'Temporary Stall',
    'Mobile Cart',
    'Roadside Vendor'
  ];

  const marketComplexes = [
    'Market Complex A',
    'Market Complex B',
    'HUT Complex 1',
    'HUT Complex 2',
    'Roadside Area 1',
    'Roadside Area 2',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Reset dependent fields when parent changes
    if (field === 'district') {
      setFormData(prev => ({ ...prev, block: '', gramPanchayat: '', village: '' }));
    } else if (field === 'block') {
      setFormData(prev => ({ ...prev, gramPanchayat: '', village: '' }));
    } else if (field === 'gramPanchayat') {
      setFormData(prev => ({ ...prev, village: '' }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            gpsLatitude: position.coords.latitude.toString(),
            gpsLongitude: position.coords.longitude.toString()
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const addPhoto = () => {
    // Simulate adding a photo
    const newPhoto = `photo_${Date.now()}.jpg`;
    setPhotos(prev => [...prev, newPhoto]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(false);
        setCurrentStep(1);
        setFormData({
          ownerName: '', fatherName: '', phone: '', alternatePhone: '', email: '', aadharNumber: '', panNumber: '',
          businessName: '', businessType: '', category: '', establishmentYear: '', gstNumber: '',
          shopType: '', shopArea: '', shopLength: '', shopWidth: '', monthlyRent: '',
          district: '', block: '', gramPanchayat: '', village: '', address: '', landmark: '', pincode: '', ward: '', marketComplex: '', gpsLatitude: '', gpsLongitude: '',
          employeeCount: '', averageMonthlyIncome: '', previousTaxPaid: '', notes: ''
        });
        setPhotos([]);
      }, 3000);
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User, color: 'from-blue-500 to-cyan-600' },
    { number: 2, title: 'Business Details', icon: Building, color: 'from-emerald-500 to-teal-600' },
    { number: 3, title: 'Shop Information', icon: Ruler, color: 'from-orange-500 to-red-600' },
    { number: 4, title: 'Location & Photos', icon: MapPin, color: 'from-purple-500 to-indigo-600' },
    { number: 5, title: 'Review & Submit', icon: CheckCircle, color: 'from-green-500 to-emerald-600' }
  ];

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-md">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Survey Submitted Successfully!
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Vendor data has been recorded and will be processed for tax registration within 24 hours.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <FileText className="w-6 h-6 text-green-600" />
              <span className="text-lg font-bold text-green-800">Survey Reference</span>
            </div>
            <p className="text-2xl font-bold text-green-700 tracking-wider">
              SUR{Date.now().toString().slice(-6)}
            </p>
            <p className="text-sm text-green-600 mt-2">Keep this reference for future correspondence</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 rounded-3xl"></div>
        <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-xl">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Vendor Survey
                </h1>
                <p className="text-gray-600 font-medium text-lg mt-1">
                  Comprehensive vendor and business information collection
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="bg-gradient-to-r from-teal-100 to-cyan-100 px-4 py-2 rounded-xl border border-teal-200">
                <span className="text-sm font-semibold text-teal-700">Step {currentStep} of 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Steps */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center space-x-4 ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 transform ${
                    isCompleted 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl scale-110' 
                      : isActive 
                        ? `bg-gradient-to-br ${step.color} text-white shadow-xl scale-110` 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-7 h-7" />
                    ) : (
                      <Icon className="w-7 h-7" />
                    )}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <p className={`text-sm font-bold transition-colors duration-300 ${
                      isActive ? 'text-teal-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">Step {step.number}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden lg:block flex-1 h-1 mx-6 rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Form Content */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Personal Information
                </h2>
                <p className="text-gray-600">Enter the vendor's personal details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Owner Name *
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-blue-300"
                  placeholder="Enter full name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Father's Name
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-blue-300"
                  placeholder="Enter father's name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-blue-300"
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-blue-300"
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-blue-300"
                  placeholder="email@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  value={formData.aadharNumber}
                  onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-blue-300"
                  placeholder="1234 5678 9012"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  PAN Number
                </label>
                <input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-blue-300"
                  placeholder="ABCDE1234F"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Business Information */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <Building className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Business Information
                </h2>
                <p className="text-gray-600">Enter business and commercial details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300"
                  placeholder="Enter business name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Business Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300"
                >
                  <option value="">Select category</option>
                  {businessCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Business Type
                </label>
                <input
                  type="text"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300"
                  placeholder="Retail, Wholesale, Service, etc."
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Establishment Year
                </label>
                <input
                  type="number"
                  value={formData.establishmentYear}
                  onChange={(e) => handleInputChange('establishmentYear', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300"
                  placeholder="2020"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  GST Number
                </label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300"
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Number of Employees
                </label>
                <input
                  type="number"
                  value={formData.employeeCount}
                  onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300"
                  placeholder="5"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Shop Information */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                <Ruler className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Shop Information
                </h2>
                <p className="text-gray-600">Physical shop details and dimensions</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Shop Type *
                </label>
                <select
                  value={formData.shopType}
                  onChange={(e) => handleInputChange('shopType', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-orange-300"
                >
                  <option value="">Select shop type</option>
                  {shopTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Total Area (sq ft) *
                </label>
                <input
                  type="number"
                  value={formData.shopArea}
                  onChange={(e) => handleInputChange('shopArea', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-orange-300"
                  placeholder="150"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Length (ft)
                </label>
                <input
                  type="number"
                  value={formData.shopLength}
                  onChange={(e) => handleInputChange('shopLength', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-orange-300"
                  placeholder="15"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Width (ft)
                </label>
                <input
                  type="number"
                  value={formData.shopWidth}
                  onChange={(e) => handleInputChange('shopWidth', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-orange-300"
                  placeholder="10"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Monthly Rent (₹)
                </label>
                <input
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-orange-300"
                  placeholder="5000"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Average Monthly Income (₹)
                </label>
                <input
                  type="number"
                  value={formData.averageMonthlyIncome}
                  onChange={(e) => handleInputChange('averageMonthlyIncome', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-orange-300"
                  placeholder="25000"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Previous Tax Paid (₹/month)
                </label>
                <input
                  type="number"
                  value={formData.previousTaxPaid}
                  onChange={(e) => handleInputChange('previousTaxPaid', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-orange-300"
                  placeholder="1200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Location & Photos */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Location & Photos
                </h2>
                <p className="text-gray-600">Address hierarchy and visual documentation</p>
              </div>
            </div>
            
            {/* Hierarchical Address Section */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200 mb-8">
              <h3 className="text-lg font-bold text-purple-800 mb-6 flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Administrative Hierarchy</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    District *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full border-2 border-purple-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:border-purple-300"
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Block *
                  </label>
                  <select
                    value={formData.block}
                    onChange={(e) => handleInputChange('block', e.target.value)}
                    disabled={!formData.district}
                    className="w-full border-2 border-purple-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Block</option>
                    {formData.district && blocks[formData.district as keyof typeof blocks]?.map(block => (
                      <option key={block} value={block}>{block}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Gram Panchayat *
                  </label>
                  <select
                    value={formData.gramPanchayat}
                    onChange={(e) => handleInputChange('gramPanchayat', e.target.value)}
                    disabled={!formData.block}
                    className="w-full border-2 border-purple-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Gram Panchayat</option>
                    {formData.block && gramPanchayats[formData.block as keyof typeof gramPanchayats]?.map(gp => (
                      <option key={gp} value={gp}>{gp}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Village *
                  </label>
                  <select
                    value={formData.village}
                    onChange={(e) => handleInputChange('village', e.target.value)}
                    disabled={!formData.gramPanchayat}
                    className="w-full border-2 border-purple-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Village</option>
                    {formData.gramPanchayat && villages[formData.gramPanchayat as keyof typeof villages]?.map(village => (
                      <option key={village} value={village}>{village}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Complete Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-purple-300"
                  placeholder="Enter complete address with house/shop number"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Landmark
                </label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => handleInputChange('landmark', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-purple-300"
                  placeholder="Near bus stand, school, etc."
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-purple-300"
                  placeholder="735101"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Ward Number
                </label>
                <input
                  type="text"
                  value={formData.ward}
                  onChange={(e) => handleInputChange('ward', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-purple-300"
                  placeholder="Ward 12"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Market Complex
                </label>
                <select
                  value={formData.marketComplex}
                  onChange={(e) => handleInputChange('marketComplex', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-purple-300"
                >
                  <option value="">Select market complex</option>
                  {marketComplexes.map(complex => (
                    <option key={complex} value={complex}>{complex}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-bold text-gray-700">
                    GPS Coordinates
                  </label>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Get Current Location</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.gpsLatitude}
                    onChange={(e) => handleInputChange('gpsLatitude', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-purple-300"
                    placeholder="Latitude"
                  />
                  <input
                    type="text"
                    value={formData.gpsLongitude}
                    onChange={(e) => handleInputChange('gpsLongitude', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-purple-300"
                    placeholder="Longitude"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-6">
                  Shop Photos
                </label>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-purple-400 transition-all duration-300">
                        <div className="flex items-center justify-center h-24">
                          <Camera className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-3 font-medium">{photo}</p>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPhoto}
                      className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-dashed border-purple-300 rounded-2xl p-6 hover:from-purple-100 hover:to-indigo-100 hover:border-purple-400 transition-all duration-300 flex flex-col items-center justify-center h-32 group"
                    >
                      <Plus className="w-10 h-10 text-purple-500 mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm text-purple-600 font-bold">Add Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="space-y-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Review & Submit
                </h2>
                <p className="text-gray-600">Verify all information before submission</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Personal Information Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <User className="w-6 h-6 text-blue-600" />
                  <span>Personal Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <span className="font-bold text-gray-700">Owner Name:</span>
                    <p className="text-gray-900">{formData.ownerName || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-gray-700">Phone:</span>
                    <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-gray-700">Email:</span>
                    <p className="text-gray-900">{formData.email || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-gray-700">Aadhar:</span>
                    <p className="text-gray-900">{formData.aadharNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              {/* Business Information Summary */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <Building className="w-6 h-6 text-emerald-600" />
                  <span>Business Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <span className="font-bold text-gray-700">Business Name:</span>
                    <p className="text-gray-900">{formData.businessName || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-gray-700">Category:</span>
                    <p className="text-gray-900">{formData.category || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-gray-700">Shop Type:</span>
                    <p className="text-gray-900">{formData.shopType || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-gray-700">Area:</span>
                    <p className="text-gray-900">{formData.shopArea ? `${formData.shopArea} sq ft` : 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              {/* Location Summary */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  <span>Location Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <span className="font-bold text-gray-700">Administrative:</span>
                    <p className="text-gray-900">
                      {[formData.district, formData.block, formData.gramPanchayat, formData.village].filter(Boolean).join(' → ') || 'Not provided'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-gray-700">Address:</span>
                    <p className="text-gray-900">{formData.address || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-gray-700">Market Complex:</span>
                    <p className="text-gray-900">{formData.marketComplex || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-gray-700">Photos:</span>
                    <p className="text-gray-900">{photos.length} uploaded</p>
                  </div>
                </div>
              </div>
              
              {/* Additional Notes */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-green-300"
                  placeholder="Any additional information, observations, or special notes about the vendor..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400 hover:scale-105 shadow-lg'
            }`}
          >
            <span>← Previous</span>
          </button>
          
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Next Step</span>
              <span>→</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Submit Survey</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Survey;