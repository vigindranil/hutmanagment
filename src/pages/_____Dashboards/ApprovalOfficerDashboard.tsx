// import React, { useEffect, useState } from 'react';
// import {
//     Users,
//     AlertTriangle,
//     Calendar,
//     CalendarClock,
//     CheckCheck,
//     Sparkles
// } from 'lucide-react';
// import StatsCard from '../../components/StatsCard';
// import { decodeJwtToken } from '../../utils/decodeToken';
// import { commonApi } from '../../Service/commonAPI';

// const ApprovalOfficerDashboard: React.FC = () => {
//     const [stats, setStats] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     const fetchApprovalOfficerDashboard = async () => {
//         try {
//             setLoading(true);
//             const userDetails = decodeJwtToken();

//             const result = await commonApi(`user/getDashboardCountByApprovalOfficerID?ApprovalOfficerID=${userDetails?.UserID}`);

//             setStats([
//                 {
//                     title: 'Total Survey',
//                     value: result?.data?.total_survey ? result?.data?.total_survey?.toString() : "0",
//                     changeType: 'positive' as const,
//                     icon: Users,
//                     color: 'blue' as const,
//                     HaatDashoardStatus: 1
//                 },
//                 {
//                     title: 'Final Approval Pending',
//                     value: result?.data?.final_approval_pending ? result?.data?.final_approval_pending?.toString() : "0",
//                     changeType: 'neutral' as const,
//                     icon: CalendarClock,
//                     color: 'red' as const,
//                     HaatDashoardStatus: 2
//                 },
//                 {
//                     title: 'Final Approval Done',
//                     value: result?.data?.final_approval_done ? result?.data?.final_approval_done?.toString() : "0",
//                     changeType: 'negative' as const,
//                     icon: CheckCheck,
//                     color: 'green' as const,
//                     HaatDashoardStatus: 3
//                 },
//                 {
//                     title: 'Final Approval Rejected',
//                     value: result?.data?.final_approval_rejected ? result?.data?.final_approval_rejected?.toString() : "0",
//                     changeType: 'neutral' as const,
//                     icon: AlertTriangle,
//                     color: 'red' as const,
//                     HaatDashoardStatus: 4
//                 }
//             ]);
//             setError(null);
//         } catch (err) {
//             console.error('Error fetching approval officer dashboard:', err);
//             setError('Failed to load dashboard data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchApprovalOfficerDashboard();
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="text-red-600 text-center">
//                     <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
//                     <p>{error}</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-8">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                     <div className="flex items-center space-x-3 mb-2">
//                         <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
//                             <Sparkles className="w-6 h-6 text-white" />
//                         </div>
//                         <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
//                             Approval Officer Dashboard
//                         </h1>
//                     </div>
//                     <p className="text-gray-600 font-medium">Welcome back to Haat Management System</p>
//                 </div>
//                 <div className="mt-4 sm:mt-0 flex items-center space-x-3 transform">
//                     <div className="relative flex items-center space-x-2 text-sm text-gray-500 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
//                         <Calendar className="w-4 h-4 text-blue-500" />
//                         <span className="font-medium">
//                             Last updated: {
//                                 (() => {
//                                     const d = new Date();
//                                     const day = String(d?.getDate()).padStart(2, '0');
//                                     const month = String(d?.getMonth() + 1).padStart(2, '0');
//                                     const year = d.getFullYear();
//                                     return `${day}/${month}/${year}`;
//                                 })()
//                             }
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {stats?.map((stat: any, index: number) => (
//                     <StatsCard dashboardType="APPROVAL_OFFICER" key={index} {...stat} />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default ApprovalOfficerDashboard;
