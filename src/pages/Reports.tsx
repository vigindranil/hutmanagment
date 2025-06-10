import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp,
  BarChart3,
  PieChart,
  IndianRupee,
  Users
} from 'lucide-react';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState('collection');

  const reportTypes = [
    {
      id: 'collection',
      name: 'Collection Report',
      description: 'Detailed payment collection analysis',
      icon: IndianRupee,
      color: 'bg-green-500'
    },
    {
      id: 'vendor',
      name: 'Vendor Report',
      description: 'Vendor registration and activity',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      id: 'defaulter',
      name: 'Defaulter Report',
      description: 'Outstanding payments and defaulters',
      icon: TrendingUp,
      color: 'bg-red-500'
    },
    {
      id: 'area',
      name: 'Area-wise Report',
      description: 'Revenue analysis by location',
      icon: PieChart,
      color: 'bg-purple-500'
    }
  ];

  const collectionData = {
    totalCollection: 284650,
    targetAmount: 320000,
    collectionRate: 89.0,
    monthlyGrowth: 8.5,
    dailyAverage: 9488,
    topPerformingArea: 'Market Complex A',
    transactions: 156
  };

  const vendorData = {
    totalVendors: 1247,
    newRegistrations: 23,
    activeVendors: 1158,
    inactiveVendors: 89,
    permanentShops: 445,
    semiPermanentShops: 356,
    temporaryStalls: 446
  };

  const recentReports = [
    {
      name: 'Monthly Collection Report - January 2024',
      type: 'Collection',
      generatedDate: '2024-01-31',
      fileSize: '2.4 MB',
      format: 'PDF'
    },
    {
      name: 'Vendor Registration Report - Q4 2023',
      type: 'Vendor',
      generatedDate: '2024-01-15',
      fileSize: '1.8 MB',
      format: 'Excel'
    },
    {
      name: 'Defaulter Analysis - December 2023',
      type: 'Defaulter',
      generatedDate: '2024-01-05',
      fileSize: '896 KB',
      format: 'PDF'
    }
  ];

  const renderCollectionReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Collection</p>
              <p className="text-2xl font-bold">₹{collectionData.totalCollection.toLocaleString()}</p>
              <p className="text-sm text-green-100">+{collectionData.monthlyGrowth}% from last month</p>
            </div>
            <IndianRupee className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Collection Rate</p>
              <p className="text-2xl font-bold">{collectionData.collectionRate}%</p>
              <p className="text-sm text-blue-100">Target: ₹{collectionData.targetAmount.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Daily Average</p>
              <p className="text-2xl font-bold">₹{collectionData.dailyAverage.toLocaleString()}</p>
              <p className="text-sm text-purple-100">{collectionData.transactions} transactions</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Top Area</p>
              <p className="text-lg font-bold">{collectionData.topPerformingArea}</p>
              <p className="text-sm text-orange-100">Highest collection</p>
            </div>
            <PieChart className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Trends</h3>
        <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <p className="text-gray-600">Interactive Collection Chart</p>
            <p className="text-sm text-gray-500 mt-1">Monthly collection trends would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVendorReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
          <h4 className="text-sm font-medium text-gray-600">Total Vendors</h4>
          <p className="text-2xl font-bold text-gray-900">{vendorData.totalVendors}</p>
          <p className="text-sm text-green-600">+{vendorData.newRegistrations} new this month</p>
        </div>

        <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-sm">
          <h4 className="text-sm font-medium text-gray-600">Active Vendors</h4>
          <p className="text-2xl font-bold text-gray-900">{vendorData.activeVendors}</p>
          <p className="text-sm text-gray-500">{((vendorData.activeVendors / vendorData.totalVendors) * 100).toFixed(1)}% of total</p>
        </div>

        <div className="bg-white p-6 rounded-xl border-l-4 border-orange-500 shadow-sm">
          <h4 className="text-sm font-medium text-gray-600">Permanent Shops</h4>
          <p className="text-2xl font-bold text-gray-900">{vendorData.permanentShops}</p>
          <p className="text-sm text-gray-500">Highest category</p>
        </div>

        <div className="bg-white p-6 rounded-xl border-l-4 border-purple-500 shadow-sm">
          <h4 className="text-sm font-medium text-gray-600">Temporary Stalls</h4>
          <p className="text-2xl font-bold text-gray-900">{vendorData.temporaryStalls}</p>
          <p className="text-sm text-gray-500">35.8% of total</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Distribution</h3>
        <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <PieChart className="w-12 h-12 text-purple-500 mx-auto mb-3" />
            <p className="text-gray-600">Vendor Distribution Chart</p>
            <p className="text-sm text-gray-500 mt-1">Breakdown by shop type and location</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-1 text-gray-500">Generate and download comprehensive reports</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedReport === report.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${report.color}`}>
                <report.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{report.name}</h3>
                <p className="text-sm text-gray-500">{report.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div>
        {selectedReport === 'collection' && renderCollectionReport()}
        {selectedReport === 'vendor' && renderVendorReport()}
        {(selectedReport === 'defaulter' || selectedReport === 'area') && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {reportTypes.find(r => r.id === selectedReport)?.name}
            </h3>
            <p className="text-gray-500 mb-4">
              {reportTypes.find(r => r.id === selectedReport)?.description}
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto">
              <Download className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        )}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentReports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{report.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>Type: {report.type}</span>
                    <span>•</span>
                    <span>Generated: {report.generatedDate}</span>
                    <span>•</span>
                    <span>Size: {report.fileSize}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {report.format}
                </span>
                <button className="text-blue-600 hover:text-blue-700 p-1">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;