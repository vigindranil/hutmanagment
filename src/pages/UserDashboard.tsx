import React, { useEffect, useState } from 'react';
import {
  Users,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Sparkles,
  Home
} from 'lucide-react';
import { FaIdCard } from "react-icons/fa";
import StatsCard from '../components/StatsCard';
import RecentActivity from '../components/RecentActivity';
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
        title: 'Total Shop',
        value: result?.data?.total_survey ? result?.data?.total_survey?.toString() : "3",
        // change: '+12%',
        changeType: 'positive' as const,
        icon: Users,
        color: 'blue' as const
      },
      {
        title: 'Survey Details',
        value: result?.data?.total_payment ? result?.data?.total_payment?.toString() : "1",
        // change: '0%',
        changeType: 'neutral' as const,
        icon: TrendingUp,
        color: 'green' as const
      },
      {
        title: 'Change Request',
        value: result?.data?.total_approval_pending ? result?.data?.total_approval_pending?.toString() : "3",
        // change: '-15%',
        changeType: 'negative' as const,
        icon: AlertTriangle,
        color: 'red' as const
      },
      {
        title: 'Initial Payment Pending (25%)',
        value: result?.data?.total_approval ? result?.data?.total_approval?.toString() : "1",
        // change: '+3.2%',
        changeType: 'positive' as const,
        // icon: TrendingUp,
        icon: IndianRupee,
        color: 'purple' as const
      },
      {
        title: 'Initial Payment Done',
        value: result?.data?.total_license_holder ? result?.data?.total_license_holder?.toString() : "1",
        // change: '+3.2%',
        changeType: 'positive' as const,
        // icon: FaIdCard,
        icon: IndianRupee,
        color: 'purple' as const
      },
      {
        title: 'Hearing Details',
        value: result?.data?.total_rent_holder ? result?.data?.total_rent_holder?.toString() : "1",
        // change: '+3.2%',
        changeType: 'positive' as const,
        // icon: Home,
        icon: FaIdCard,
        color: 'purple' as const
      },
      {
        title: 'Final Payment (Rest 75%)',
        value: result?.data?.total_rent_holder ? result?.data?.total_rent_holder?.toString() : "1",
        // change: '+3.2%',
        changeType: 'positive' as const,
        // icon: Home,
        icon: IndianRupee,
        color: 'purple' as const
      },
      {
        title: 'Licence Details',
        value: result?.data?.total_rent_holder ? result?.data?.total_rent_holder?.toString() : "1",
        // change: '+3.2%',
        changeType: 'positive' as const,
        icon: FaIdCard,
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
          <p className="text-gray-600 font-medium">Welcome back to Haat Management System</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="font-medium">
              Last updated: {
                (() => {
                  const d = new Date();
                  const day = String(d?.getDate()).padStart(2, '0');
                  const month = String(d?.getMonth() + 1).padStart(2, '0');
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

      {/* Recent Activity */}
      <RecentActivity activities={recentActivities} />
    </div>
  );
};

export default Dashboard;