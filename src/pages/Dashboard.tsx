import React, { useEffect, useState } from 'react';
import {
  Users,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Calendar,
  Building,
  CreditCard,
  Sparkles,
  BarChart3
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import RecentActivity from '../components/RecentActivity';
import QuickActions from '../components/QuickActions';
import Cookies from 'js-cookie';
import { decodeJwtToken } from '../utils/decodeToken';
import { commonApi } from '../commonAPI';


const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);


  const recentActivities = [
    {
      type: 'payment' as const,
      description: 'Payment received from Raj Grocery Store',
      amount: '₹1,200',
      time: '2 hours ago',
      status: 'success' as const
    },
    {
      type: 'registration' as const,
      description: 'New vendor registered - Modern Tailors',
      location: 'Market Complex A',
      time: '4 hours ago',
      status: 'info' as const
    },
    {
      type: 'defaulter' as const,
      description: 'Vendor marked as defaulter - ABC Electronics',
      amount: '₹3,600',
      time: '6 hours ago',
      status: 'warning' as const
    },
    {
      type: 'survey' as const,
      description: 'Survey completed for Block 12',
      location: '45 vendors surveyed',
      time: '1 day ago',
      status: 'success' as const
    }
  ];

  const dashboardApiCall = async () => {
    const userDetails = decodeJwtToken();

    const result = await commonApi(`user/getAdminDashboardDetails?UserID=${userDetails?.UserID}`);
    setStats([
      {
        title: 'Total Vendors',
        value: result?.data?.total_survey ? result?.data?.total_survey.toString() : "0",
        change: '+12%',
        changeType: 'positive' as const,
        icon: Users,
        color: 'blue' as const
      },
      {
        title: 'Total Payment',
        value: result?.data?.total_payment ? result?.data?.total_payment.toString() : "0",
        change: '0%',
        changeType: 'neutral' as const,
        icon: IndianRupee,
        color: 'green' as const
      },
      {
        title: 'Pending Approvals',
        value: result?.data?.total_approval_pending ? result?.data?.total_approval_pending.toString() : "0",
        change: '-15%',
        changeType: 'negative' as const,
        icon: AlertTriangle,
        color: 'red' as const
      },
      {
        title: 'Approved Applications',
        value: result?.data?.total_approval ? result?.data?.total_approval.toString() : "0",
        change: '+3.2%',
        changeType: 'positive' as const,
        icon: TrendingUp,
        color: 'purple' as const
      }
    ])
  }
  useEffect(() => {
    dashboardApiCall();
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-600 font-medium">Welcome back to Vendor Tax Management System</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="font-medium">
              Last updated: {
                (() => {
                  const d = new Date();
                  const day = String(d.getDate()).padStart(2, '0');
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  const year = d.getFullYear();
                  return `${day}/${month}/${year}`;
                })()
              }
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.map((stat: any, index: number) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Collection Overview */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Collection Overview
                </h2>
              </div>
              <select className="text-sm border border-gray-200 rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>This month</option>
              </select>
            </div>

            {/* Mock chart area */}
            <div className="h-64 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
              <div className="text-center">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl mb-4 inline-block">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
                <p className="text-gray-700 font-semibold text-lg">Collection Analytics Chart</p>
                <p className="text-sm text-gray-500 mt-2">Interactive chart would be displayed here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-10 translate-x-10"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Area Overview
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full shadow-lg"></div>
                    <span className="text-sm font-medium text-gray-700">Market Complex A</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-lg shadow">156 vendors</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg"></div>
                    <span className="text-sm font-medium text-gray-700">Market Complex B</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-lg shadow">203 vendors</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-full shadow-lg"></div>
                    <span className="text-sm font-medium text-gray-700">Roadside Stalls</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-lg shadow">642 vendors</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-lg"></div>
                    <span className="text-sm font-medium text-gray-700">HUT Complexes</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-lg shadow">246 vendors</span>
                </div>
              </div>
            </div>
          </div>

          <QuickActions />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivities} />
    </div>
  );
};

export default Dashboard;