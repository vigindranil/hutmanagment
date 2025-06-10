import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color
}) => {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-500 to-cyan-600',
      bg: 'from-blue-50 to-cyan-50',
      shadow: 'shadow-blue-500/20',
      ring: 'ring-blue-500/10'
    },
    green: {
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'from-emerald-50 to-teal-50',
      shadow: 'shadow-emerald-500/20',
      ring: 'ring-emerald-500/10'
    },
    red: {
      gradient: 'from-red-500 to-pink-600',
      bg: 'from-red-50 to-pink-50',
      shadow: 'shadow-red-500/20',
      ring: 'ring-red-500/10'
    },
    purple: {
      gradient: 'from-purple-500 to-indigo-600',
      bg: 'from-purple-50 to-indigo-50',
      shadow: 'shadow-purple-500/20',
      ring: 'ring-purple-500/10'
    },
    orange: {
      gradient: 'from-orange-500 to-red-600',
      bg: 'from-orange-50 to-red-50',
      shadow: 'shadow-orange-500/20',
      ring: 'ring-orange-500/10'
    }
  };

  const changeColorClass = {
    positive: 'text-emerald-600 bg-emerald-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  }[changeType];

  const colorConfig = colorClasses[color];

  return (
    <div className={`relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl ${colorConfig.shadow} border border-white/20 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 group overflow-hidden`}>
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.bg} opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
          <div className="flex items-center">
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${changeColorClass}`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorConfig.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;