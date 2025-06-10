import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Phone,
  Building,
  Calendar
} from 'lucide-react';

const Vendors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const vendors = [
    {
      id: 1,
      businessName: 'Raj Grocery Store',
      ownerName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      type: 'Permanent',
      category: 'Grocery',
      address: 'Market Complex A, Shop 12',
      area: '150 sq ft',
      taxPeriod: 'Monthly',
      status: 'Active',
      lastPayment: '2024-01-15',
      outstanding: 0
    },
    {
      id: 2,
      businessName: 'Modern Tailors',
      ownerName: 'Suresh Sharma',
      phone: '+91 87654 32109',
      type: 'Permanent',
      category: 'Clothing',
      address: 'Market Complex B, Shop 8',
      area: '200 sq ft',
      taxPeriod: 'Monthly',
      status: 'Active',
      lastPayment: '2024-01-10',
      outstanding: 0
    },
    {
      id: 3,
      businessName: 'ABC Electronics',
      ownerName: 'Amit Patel',
      phone: '+91 76543 21098',
      type: 'Semi-Permanent',
      category: 'Electronics',
      address: 'Roadside Stall, Block 5',
      area: '100 sq ft',
      taxPeriod: 'Weekly',
      status: 'Defaulter',
      lastPayment: '2023-12-01',
      outstanding: 3600
    },
    {
      id: 4,
      businessName: 'Fresh Fruits Corner',
      ownerName: 'Ravi Singh',
      phone: '+91 65432 10987',
      type: 'Temporary',
      category: 'Food',
      address: 'HUT Complex, Stall 15',
      area: '80 sq ft',
      taxPeriod: 'Daily',
      status: 'Active',
      lastPayment: '2024-01-16',
      outstanding: 0
    }
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || vendor.type.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string, outstanding: number) => {
    if (status === 'Defaulter') {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Defaulter</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
          <p className="mt-1 text-gray-500">Manage all registered vendors and their details</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Vendor</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors by name or business..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="permanent">Permanent</option>
                <option value="semi-permanent">Semi-Permanent</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{vendor.businessName}</h3>
                <p className="text-gray-600">{vendor.ownerName}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(vendor.status, vendor.outstanding)}
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {vendor.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {vendor.address}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Building className="w-4 h-4 mr-2" />
                {vendor.type} • {vendor.category} • {vendor.area}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Tax Period: {vendor.taxPeriod}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last Payment:</span>
                <span className="font-medium text-gray-900">{vendor.lastPayment}</span>
              </div>
              {vendor.outstanding > 0 && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Outstanding:</span>
                  <span className="font-medium text-red-600">₹{vendor.outstanding.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No vendors found</h3>
            <p className="mt-1">Try adjusting your search criteria or add a new vendor.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;