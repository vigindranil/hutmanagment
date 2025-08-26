import React, { useEffect, useState } from 'react';
import {
  Users,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { FaIdCard } from "react-icons/fa";
import StatsCard from '../components/StatsCard';
import { decodeJwtToken } from '../utils/decodeToken';
import { commonApi } from '../commonAPI';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);


  const UserdashboardApiCall = async () => {
    const userDetails = decodeJwtToken();

    const result = await commonApi(`user/getDashboardDetailsByShopOwnerID?ShopOwnerID=${userDetails?.UserID}`);
    console.log(result);
    
    setStats([
      {
        title: 'Total Shop',
        value: result?.data?.total_shops ? result?.data?.total_shops?.toString() : "0",
        changeType: 'positive' as const,
        icon: Users,
        color: 'blue' as const,
        HaatDashoardStatus: 1
      },
      // {
      //   title: 'Complete Survey',
      //   value: result?.data?.complete_survey ? result?.data?.complete_survey?.toString() : "0",
      //   changeType: 'neutral' as const,
      //   icon: TrendingUp,
      //   color: 'green' as const,
      //   HaatDashoardStatus: 2
      // },
      {
        title: 'Change Request',
        value: result?.data?.changing_request ? result?.data?.changing_request?.toString() : "0",
        changeType: 'negative' as const,
        icon: AlertTriangle,
        color: 'red' as const,
        HaatDashoardStatus: 3
      },
      {
        title: 'Initial Payment Pending',
        value: result?.data?.initial_payment_pending ? result?.data?.initial_payment_pending?.toString() : "0",
        changeType: 'positive' as const,
        icon: IndianRupee,
        color: 'red' as const,
        HaatDashoardStatus: 4
      },
      // {
      //   title: 'Initial Payment Done',
      //   value: result?.data?.initial_payment_done ? result?.data?.initial_payment_done?.toString() : "0",
      //   changeType: 'positive' as const,
      //   icon: IndianRupee,
      //   color: 'green' as const,
      //   HaatDashoardStatus: 5
      // },
      {
        title: 'Hearing Date Initiated',
        value: result?.data?.hearing_done ? result?.data?.hearing_done?.toString() : "0",        
        changeType: 'positive' as const,     
        icon: FaIdCard,
        color: 'purple' as const,
        HaatDashoardStatus: 6
      },
      {
        title: 'Final Payment Pending',
        value: result?.data?.final_payment_pending ? result?.data?.final_payment_pending?.toString() : "0",  
        changeType: 'positive' as const,        
        icon: IndianRupee,
        color: 'red' as const,
        HaatDashoardStatus: 7
      },
      // {
      //   title: 'Final Payment Done',
      //   value: result?.data?.final_payment_done ? result?.data?.final_payment_done?.toString() : "0",        
      //   changeType: 'positive' as const,        
      //   icon: IndianRupee,
      //   color: 'green' as const,
      //   HaatDashoardStatus: 8
      // },
      {
        title: 'Licence Details',
        value: result?.data?.licensed_shops ? result?.data?.licensed_shops?.toString() : "0",
        changeType: 'positive' as const,
        icon: FaIdCard,
        color: 'purple' as const,
        HaatDashoardStatus: 9
      }
    ])
  }

  useEffect(() => {
    UserdashboardApiCall();
  }, [])

  // Handle browser back button (popstate event)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Show confirm dialog for logout
      const shouldLogout = window.confirm("Do you want to logout?");
      if (shouldLogout) {
        // Clear local storage/session and redirect to login (customize as needed)
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      } else {
        // Push current state again to prevent navigation
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.history.pushState(null, '', window.location.pathname); // Push initial state
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* <div
  className="w-screen bg-red-200 h-screen bg-cover bg-center"
  
></div> */}
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
          <StatsCard dashboardType="USER" key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;