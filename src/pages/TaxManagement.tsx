import React, { useState } from 'react';
import { Calculator, Settings, Plus, Edit, Trash2, IndianRupee } from 'lucide-react';

const TaxManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rates');

  const taxRates = [
    {
      id: 1,
      type: 'Permanent',
      category: 'Grocery',
      areaRange: '0-100 sq ft',
      ratePerSqFt: 25,
      minAmount: 500,
      maxAmount: 2500
    },
    {
      id: 2,
      type: 'Permanent',
      category: 'Clothing',
      areaRange: '0-150 sq ft',
      ratePerSqFt: 30,
      minAmount: 750,
      maxAmount: 4500
    },
    {
      id: 3,
      type: 'Semi-Permanent',
      category: 'Electronics',
      areaRange: '0-120 sq ft',
      ratePerSqFt: 20,
      minAmount: 400,
      maxAmount: 2400
    },
    {
      id: 4,
      type: 'Temporary',
      category: 'Food',
      areaRange: '0-80 sq ft',
      ratePerSqFt: 15,
      minAmount: 300,
      maxAmount: 1200
    }
  ];

  const recentBills = [
    {
      id: 'TXN001',
      vendorName: 'Raj Grocery Store',
      amount: 1200,
      period: 'January 2024',
      status: 'Paid',
      dueDate: '2024-01-31',
      paidDate: '2024-01-15'
    },
    {
      id: 'TXN002',
      vendorName: 'Modern Tailors',
      amount: 1800,
      period: 'January 2024',
      status: 'Pending',
      dueDate: '2024-01-31',
      paidDate: null
    },
    {
      id: 'TXN003',
      vendorName: 'Fresh Fruits Corner',
      amount: 450,
      period: 'Weekly - Week 3',
      status: 'Overdue',
      dueDate: '2024-01-21',
      paidDate: null
    }
  ];

  const getStatusBadge = (status: string) => {
    const classes = {
      'Paid': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Overdue': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[status as keyof typeof classes]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Management</h1>
          <p className="mt-1 text-gray-500">Configure tax rates and manage billing</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('rates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'rates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tax Rates
            </button>
            <button
              onClick={() => setActiveTab('bills')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'bills'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recent Bills
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'calculator'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tax Calculator
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Tax Rates Tab */}
          {activeTab === 'rates' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Tax Rate Configuration</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Rate</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shop Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Area Range
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate/Sq Ft
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Min-Max Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {taxRates.map((rate) => (
                      <tr key={rate.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {rate.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rate.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rate.areaRange}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{rate.ratePerSqFt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{rate.minAmount} - ₹{rate.maxAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Bills Tab */}
          {activeTab === 'bills' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Tax Bills</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Generate Bill</span>
                </button>
              </div>

              <div className="space-y-4">
                {recentBills.map((bill) => (
                  <div key={bill.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-medium text-gray-900">{bill.vendorName}</h3>
                          {getStatusBadge(bill.status)}
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <span>Bill ID: {bill.id}</span>
                          <span className="mx-2">•</span>
                          <span>Period: {bill.period}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">₹{bill.amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          Due: {bill.dueDate}
                        </div>
                        {bill.paidDate && (
                          <div className="text-sm text-green-600">
                            Paid: {bill.paidDate}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tax Calculator Tab */}
          {activeTab === 'calculator' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Tax Calculator</h2>
              
              <div className="max-w-md">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shop Type
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Permanent</option>
                      <option>Semi-Permanent</option>
                      <option>Temporary</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Category
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Grocery</option>
                      <option>Clothing</option>
                      <option>Electronics</option>
                      <option>Food</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shop Area (sq ft)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter area in sq ft"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <Calculator className="w-4 h-4" />
                    <span>Calculate Tax</span>
                  </button>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <IndianRupee className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Calculated Tax Amount</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">₹1,500</div>
                  <div className="text-sm text-blue-600 mt-1">Monthly tax for 100 sq ft Grocery shop</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxManagement;