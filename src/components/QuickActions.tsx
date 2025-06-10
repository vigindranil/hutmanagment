import React from 'react';
import { Plus, FileText, Search, Download } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Add Vendor',
      description: 'Register new vendor',
      icon: Plus,
      gradient: 'from-blue-500 to-cyan-600',
      shadow: 'shadow-blue-500/25',
      action: () => console.log('Add vendor clicked')
    },
    {
      title: 'Generate Bill',
      description: 'Create tax bill',
      icon: FileText,
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/25',
      action: () => console.log('Generate bill clicked')
    },
    {
      title: 'Search Vendor',
      description: 'Find vendor details',
      icon: Search,
      gradient: 'from-orange-500 to-red-600',
      shadow: 'shadow-orange-500/25',
      action: () => console.log('Search vendor clicked')
    },
    {
      title: 'Export Report',
      description: 'Download reports',
      icon: Download,
      gradient: 'from-purple-500 to-indigo-600',
      shadow: 'shadow-purple-500/25',
      action: () => console.log('Export report clicked')
    }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`group relative bg-gradient-to-br ${action.gradient} text-white p-4 rounded-xl transition-all duration-300 hover:shadow-xl ${action.shadow} hover:scale-105 transform overflow-hidden`}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <action.icon className="w-6 h-6 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-sm font-bold mb-1">{action.title}</div>
              <div className="text-xs opacity-90">{action.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;