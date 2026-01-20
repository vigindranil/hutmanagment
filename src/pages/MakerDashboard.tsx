import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Calendar,
  CalendarClock,
  Sparkles,
  Store
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { decodeJwtToken } from '../utils/decodeToken';
import { commonApi } from '../Service/surveyAPI';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);


  const MakerDashboardApiCall = async () => {
    const userDetails = decodeJwtToken();
    console.log("User Details from Token:", userDetails);

    // Extract values from token, with fallback to default values
    const BoundaryLevelID = userDetails?.BoundaryLevelID || 2;
    const BoundaryID = userDetails?.BoundaryID || 9;
    const UserID = userDetails?.UserID || 72;

    console.log("API Parameters:", { BoundaryLevelID, BoundaryID, UserID });

    const result = await commonApi(
      `user/getSurveyCountForMakerByBoundaryID?BoundaryLevelID=${BoundaryLevelID}&BoundaryID=${BoundaryID}&UserID=${UserID}`,
      {},
      "POST"
    );
    console.log("Maker Dashboard API Result:", result);

    setStats([
      {
        title: 'Total Applications',
        value: result?.data?.total_applications ? result?.data?.total_applications?.toString() : "0",
        changeType: 'positive' as const,
        icon: Store,
        color: 'blue' as const,
        HaatDashoardStatus: 1
      },
      {
        title: 'Pending Applications',
        value: result?.data?.pending_applications ? result?.data?.pending_applications?.toString() : "0",
        changeType: 'neutral' as const,
        icon: CalendarClock,
        color: 'orange' as const,
        HaatDashoardStatus: 2
      },
      {
        title: 'Modified Applications',
        value: result?.data?.modified_applications ? result?.data?.modified_applications?.toString() : "0",
        changeType: 'positive' as const,
        icon: TrendingUp,
        color: 'purple' as const,
        HaatDashoardStatus: 3
      },
    ])
  }

  useEffect(() => {
    MakerDashboardApiCall();
  }, [])

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
              Maker Dashboard
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats?.map((stat: any, index: number) => (
          <StatsCard dashboardType="MAKER" key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;