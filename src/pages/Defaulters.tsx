import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Phone, 
  MapPin, 
  Clock,
  IndianRupee,
  Flag,
  MessageSquare
} from 'lucide-react';

const Defaulters: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const defaulters = [
    {
      id: 1,
      businessName: 'ABC Electronics',
      ownerName: 'Amit Patel',
      phone: '+91 76543 21098',
      address: 'Roadside Stall, Block 5',
      outstandingAmount: 3600,
      missedPayments: 4,
      lastPaymentDate: '2023-12-01',
      daysSinceLastPayment: 46,
      riskLevel: 'High',
      notes: 'Owner contacted, promised payment by month end'
    },
    {
      id: 2,
      businessName: 'Quick Snacks Corner',
      ownerName: 'Raman Singh',
      phone: '+91 98765 12345',
      address: 'HUT Complex, Stall 22',
      outstandingAmount: 1800,
      missedPayments: 3,
      lastPaymentDate: '2023-12-15',
      daysSinceLastPayment: 32,
      riskLevel: 'Medium',
      notes: 'Business temporarily closed due to illness'
    },
    {
      id: 3,
      businessName: 'City Book Store',
      ownerName: 'Priya Sharma',
      phone: '+91 87654 98765',
      address: 'Market Complex B, Shop 15',
      outstandingAmount: 5400,
      missedPayments: 6,
      lastPaymentDate: '2023-11-10',
      daysSinceLastPayment: 67,
      riskLevel: 'Critical',
      notes: 'Legal notice served, no response received'
    },
    {
      id: 4,
      businessName: 'Mobile Repair Shop',
      ownerName: 'Kiran Kumar',
      phone: '+91 76543 87654',
      address: 'Market Complex A, Shop 8',
      outstandingAmount: 2700,
      missedPayments: 3,
      lastPaymentDate: '2023-12-20',
      daysSinceLastPayment: 27,
      riskLevel: 'Medium',
      notes: 'Payment plan requested, under review'
    }
  ];

  const filteredDefaulters = defaulters.filter(defaulter =>
    defaulter.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    defaulter.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskLevelBadge = (riskLevel: string) => {
    const classes = {
      'Critical': 'bg-red-100 text-red-800 border-red-200',
      'High': 'bg-orange-100 text-orange-800 border-orange-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Low': 'bg-green-100 text-green-800 border-green-200'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${classes[riskLevel as keyof typeof classes]}`}>
        {riskLevel} Risk
      </span>
    );
  };

  const getRiskLevelColor = (riskLevel: string) => {
    const colors = {
      'Critical': 'text-red-600',
      'High': 'text-orange-600',
      'Medium': 'text-yellow-600',
      'Low': 'text-green-600'
    };
    return colors[riskLevel as keyof typeof colors];
  };

  const totalOutstanding = filteredDefaulters.reduce((sum, defaulter) => sum + defaulter.outstandingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Defaulter Management</h1>
          <p className="mt-1 text-gray-500">Track and manage vendors with overdue payments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Defaulters</p>
              <p className="text-2xl font-bold text-gray-900">{defaulters.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <IndianRupee className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding Amount</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalOutstanding.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Flag className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Cases</p>
              <p className="text-2xl font-bold text-gray-900">
                {defaulters.filter(d => d.riskLevel === 'Critical').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Days Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(defaulters.reduce((sum, d) => sum + d.daysSinceLastPayment, 0) / defaulters.length)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search defaulters by business name or owner..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Defaulters List */}
      <div className="space-y-4">
        {filteredDefaulters.map((defaulter) => (
          <div key={defaulter.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{defaulter.businessName}</h3>
                      {getRiskLevelBadge(defaulter.riskLevel)}
                    </div>
                    <p className="text-gray-600 mt-1">{defaulter.ownerName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                      ₹{defaulter.outstandingAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Outstanding</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {defaulter.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {defaulter.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {defaulter.missedPayments} missed payments
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {defaulter.daysSinceLastPayment} days overdue
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Last Payment: {defaulter.lastPaymentDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </button>
                    <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors duration-200 flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>SMS</span>
                    </button>
                    <button className="bg-orange-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-700 transition-colors duration-200">
                      Legal Notice
                    </button>
                  </div>
                </div>

                {defaulter.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="w-4 h-4 mt-0.5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Notes:</p>
                        <p className="text-sm text-gray-600">{defaulter.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDefaulters.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No defaulters found</h3>
            <p className="mt-1">Try adjusting your search criteria.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Defaulters;