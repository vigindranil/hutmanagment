import React from 'react';
import { CreditCard, UserPlus, AlertCircle, FileCheck } from 'lucide-react';

interface Activity {
  type: 'payment' | 'registration' | 'defaulter' | 'survey';
  description: string;
  amount?: string;
  location?: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getIcon = (type: Activity['type']) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'payment':
        return <CreditCard className={iconClass} />;
      case 'registration':
        return <UserPlus className={iconClass} />;
      case 'defaulter':
        return <AlertCircle className={iconClass} />;
      case 'survey':
        return <FileCheck className={iconClass} />;
      default:
        return <FileCheck className={iconClass} />;
    }
  };

  const getStatusColors = (status: Activity['status']) => {
    switch (status) {
      case 'success':
        return {
          bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: 'bg-gradient-to-br from-emerald-500 to-teal-600'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-br from-orange-50 to-red-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          icon: 'bg-gradient-to-br from-orange-500 to-red-600'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: 'bg-gradient-to-br from-blue-500 to-cyan-600'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: 'bg-gradient-to-br from-gray-500 to-slate-600'
        };
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Recent Activity
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-all duration-200">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const colors = getStatusColors(activity.status);
          return (
            <div key={index} className={`group flex items-start space-x-4 p-4 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}>
              <div className={`p-2 rounded-xl ${colors.icon} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {getIcon(activity.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{activity.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  {activity.amount && (
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
                      {activity.amount}
                    </span>
                  )}
                  {activity.location && (
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                      {activity.location}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500 flex-shrink-0 bg-white/50 px-2 py-1 rounded-lg">
                {activity.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;