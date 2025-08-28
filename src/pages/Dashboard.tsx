import React, { useEffect, useState } from 'react';
import {
  Users,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Sparkles,
  Home,
  CheckCheck,
  CalendarClock
} from 'lucide-react';
import { FaIdCard } from "react-icons/fa";
import StatsCard from '../components/StatsCard';
import { decodeJwtToken } from '../utils/decodeToken';
import { commonApi } from '../commonAPI';


const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);


  const dashboardApiCall = async () => {
    const userDetails = decodeJwtToken();

  
  //Admin Dashboard
  const result = await commonApi(`user/getAdminDashboardDetails?UserID=${userDetails?.UserID}`);
  setStats([
      {
        title: 'Total Vendors',
        value: result?.data?.total_survey ? result?.data?.total_survey?.toString() : "0",
        // change: '+12%',
        changeType: 'positive' as const,
        icon: Users,
        color: 'blue' as const,
        HaatDashoardStatus: 1
      },
      {
        title: 'Total Payment',
        value: result?.data?.total_payment ? result?.data?.total_payment?.toString() : "0",
        // change: '0%',
        changeType: 'neutral' as const,
        icon: IndianRupee,
        color: 'green' as const,
        HaatDashoardStatus: 2
      },
      {
        title: 'Pending Approvals',
        value: result?.data?.total_approval_pending ? result?.data?.total_approval_pending?.toString() : "0",
        // change: '-15%',
        changeType: 'negative' as const,
        icon: AlertTriangle,
        color: 'red' as const,
        HaatDashoardStatus: 3
      },
      {
        title: 'Approved Applications',
        value: result?.data?.total_approval ? result?.data?.total_approval?.toString() : "0",
        // change: '+3.2%',
        changeType: 'positive' as const,
        icon: TrendingUp,
        color: 'purple' as const,
        HaatDashoardStatus: 4
      },
      {
        title: 'License Holder',
        value: result?.data?.total_license_holder ? result?.data?.total_license_holder?.toString() : "0",
        // change: '+3.2%',
        changeType: 'positive' as const,
        icon: FaIdCard,
        color: 'purple' as const,
        HaatDashoardStatus: 5
      },
      {
        title: 'Rent Holder',
        value: result?.data?.total_rent_holder ? result?.data?.total_rent_holder?.toString() : "0",
        // change: '+3.2%',
        changeType: 'positive' as const,
        icon: Home,
        color: 'purple' as const,
        HaatDashoardStatus: 6
      }
    ])
  }
  
  //Checker Dashboard
  const getDashBoardDetailsByCheckerID = async () => {
    const userDetails = decodeJwtToken();
    const result = await commonApi(`user/getDashBoardCountDetailsByCheckerID?CheckerID=${userDetails?.UserID}`);
    setStats([
      {
        title: 'Total Survey',
        value: result?.data?.total_survey ? result?.data?.total_survey?.toString() : "0",
        changeType: 'positive' as const,
        icon: Users,
        color: 'blue' as const,
        HaatDashoardStatus: 1
      },
      {
        title: 'Hearing Date Pending',
        value: result?.data?.hearing_pending ? result?.data?.hearing_pending?.toString() : "0",
        changeType: 'neutral' as const,
        icon: CalendarClock,
        color: 'red' as const,
        HaatDashoardStatus: 2
      },
      {
        title: 'Hearing Date Initiated',
        value: result?.data?.hearing_initiated ? result?.data?.hearing_initiated?.toString() : "0",
        changeType: 'negative' as const,
        icon: CheckCheck,
        color: 'green' as const,
        HaatDashoardStatus: 3
      },
      {
        title: 'Initial Payment Done',
        value: result?.data?.initial_payment_done ? result?.data?.initial_payment_done?.toString() : "0",
        changeType: 'neutral' as const,
        icon: IndianRupee,
        color: 'green' as const,
        HaatDashoardStatus: 4
      }
    ])
  }

  //Hearing Officer Dashboard
  const getHearingCountByHearingUserID = async () => {
    const userDetails = decodeJwtToken();
    const result = await commonApi(`user/getHearingCountByHearingUserID?HearingUserID=${userDetails?.UserID}`);

    setStats([
      {
        title: 'Hearing Pending',
        value: result?.data?.hearing_pending ? result?.data?.hearing_pending?.toString() : "0",
        changeType: 'positive' as const,
        icon: CalendarClock,
        color: 'red' as const,
        HaatDashoardStatus: 1
      },
      {
        title: 'Approved Hearing',
        value: result?.data?.approved_hearing ? result?.data?.approved_hearing?.toString() : "0",
        changeType: 'neutral' as const,
        icon: CheckCheck,
        color: 'green' as const,
        HaatDashoardStatus: 2
      },
      {
        title: 'Rejected Hearing',
        value: result?.data?.rejected_hearing ? result?.data?.rejected_hearing?.toString() : "0",
        changeType: 'neutral' as const,
        icon: AlertTriangle,
        color: 'red' as const,
        HaatDashoardStatus: 3
      }
    ]);
  };


  // approve officer Dashboard
  const getApproveOfficerDashboard = async () => {
    const userDetails = decodeJwtToken();
    const result = await commonApi(`user/getDashboardCountByApprovalOfficerID?ApprovalOfficerID=${userDetails?.UserID}`);

    setStats([
      {
        title: 'Total Survey',
        value: result?.data?.total_survey ? result?.data?.total_survey?.toString() : "0",
        changeType: 'positive' as const,
        icon: Users,
        color: 'blue' as const,
        HaatDashoardStatus: 1
      },
      {
        title: 'Final Approval Pending',
        value: result?.data?.final_approval_pending ? result?.data?.final_approval_pending?.toString() : "0",
        changeType: 'neutral' as const,
        icon: CalendarClock,
        color: 'red' as const,
        HaatDashoardStatus: 2
      },
      {
        title: 'Final Approval Done',
        value: result?.data?.final_approval_done ? result?.data?.final_approval_done?.toString() : "0",
        changeType: 'negative' as const,
        icon: CheckCheck,
        color: 'green' as const,
        HaatDashoardStatus: 3
      },
      {
        title: 'Final Approval Rejected',
        value: result?.data?.final_approval_rejected ? result?.data?.final_approval_rejected?.toString() : "0",
        changeType: 'neutral' as const,
        icon: AlertTriangle,
        color: 'red' as const,
        HaatDashoardStatus: 4
      }
    ]);
  };



  useEffect(() => {
    const user_details = decodeJwtToken();
    console.log(user_details);

    if (user_details?.UserTypeID === 100) {
      dashboardApiCall();
    } else if (user_details?.UserTypeID === 50) {
      getDashBoardDetailsByCheckerID();
    }else if (user_details?.UserTypeID === 60) {
      getHearingCountByHearingUserID();
    }
    else if (user_details?.UserTypeID === 70) {
      getApproveOfficerDashboard();
    }
  }, []);

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
        <div className="mt-4 sm:mt-0 flex items-center space-x-3 transform">
          <div className="relative flex items-center space-x-2 text-sm text-gray-500 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
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
          <StatsCard dashboardType="ADMIN" key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;