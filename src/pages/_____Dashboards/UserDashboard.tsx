// import React, { useEffect, useState } from 'react';
// import {
//     IndianRupee,
//     AlertTriangle,
//     SquarePen,
//     Calendar,
//     CalendarClock,
//     Sparkles,
//     Store
// } from 'lucide-react';
// import { FaIdCard } from "react-icons/fa";
// import StatsCard from '../../components/StatsCard';
// import { decodeJwtToken } from '../../utils/decodeToken';
// import { commonApi } from '../../Service/commonAPI';

// const UserDashboard: React.FC = () => {
//     const [stats, setStats] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     const ClockArrowDownIcon = () => (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="white"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="lucide lucide-clock-arrow-down"
//         >
//             <path d="M12 6v6l2 1" />
//             <path d="M12.337 21.994a10 10 0 1 1 9.588-8.767" />
//             <path d="m14 18 4 4 4-4" />
//             <path d="M18 14v8" />
//         </svg>
//     );

//     const fetchUserDashboard = async () => {
//         try {
//             setLoading(true);
//             const userDetails = decodeJwtToken();

//             const result = await commonApi(`user/getDashboardDetailsByShopOwnerID?ShopOwnerID=${userDetails?.UserID}`);
//             console.log(result);

//             setStats([
//                 {
//                     title: 'Total Shop',
//                     value: result?.data?.total_shops ? result?.data?.total_shops?.toString() : "0",
//                     changeType: 'positive' as const,
//                     icon: Store,
//                     color: 'green' as const,
//                     HaatDashoardStatus: 1
//                 },
//                 {
//                     title: 'Change Request',
//                     value: result?.data?.changing_request ? result?.data?.changing_request?.toString() : "0",
//                     changeType: 'negative' as const,
//                     icon: SquarePen,
//                     color: 'red' as const,
//                     HaatDashoardStatus: 3
//                 },
//                 {
//                     title: 'Initial Payment Pending',
//                     value: result?.data?.initial_payment_pending ? result?.data?.initial_payment_pending?.toString() : "0",
//                     changeType: 'positive' as const,
//                     icon: IndianRupee,
//                     color: 'orange' as const,
//                     HaatDashoardStatus: 4
//                 },
//                 {
//                     title: 'Hearing Date Pending',
//                     value: result?.data?.hearing_initiated ? result?.data?.hearing_initiated?.toString() : "0",
//                     changeType: 'positive' as const,
//                     icon: CalendarClock,
//                     color: 'orange' as const,
//                     HaatDashoardStatus: 6
//                 },
//                 {
//                     title: 'Final Payment Pending',
//                     value: result?.data?.final_payment_pending ? result?.data?.final_payment_pending?.toString() : "0",
//                     changeType: 'positive' as const,
//                     icon: IndianRupee,
//                     color: 'orange' as const,
//                     HaatDashoardStatus: 7
//                 },
//                 {
//                     title: 'Final Approval Pending',
//                     value: result?.data?.final_approval_pending ? result?.data?.final_approval_pending?.toString() : "0",
//                     changeType: 'positive' as const,
//                     icon: ClockArrowDownIcon,
//                     color: 'orange' as const,
//                     HaatDashoardStatus: 11
//                 },
//                 {
//                     title: 'Licence Details',
//                     value: result?.data?.licensed_shops ? result?.data?.licensed_shops?.toString() : "0",
//                     changeType: 'positive' as const,
//                     icon: FaIdCard,
//                     color: 'green' as const,
//                     HaatDashoardStatus: 9
//                 },
//                 {
//                     title: 'Reject Application',
//                     value: result?.data?.rejected_applications ? result?.data?.rejected_applications?.toString() : "0",
//                     changeType: 'positive' as const,
//                     icon: AlertTriangle,
//                     color: 'red' as const,
//                     HaatDashoardStatus: 10
//                 },
//             ]);
//             setError(null);
//         } catch (err) {
//             console.error('Error fetching user dashboard:', err);
//             setError('Failed to load dashboard data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUserDashboard();
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
//                             User Dashboard
//                         </h1>
//                     </div>
//                     <p className="text-gray-600 font-medium">Welcome back to Haat Management System</p>
//                 </div>
//                 <div className="mt-4 sm:mt-0 flex items-center space-x-3">
//                     <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
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
//                     <StatsCard dashboardType="USER" key={index} {...stat} />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default UserDashboard;
