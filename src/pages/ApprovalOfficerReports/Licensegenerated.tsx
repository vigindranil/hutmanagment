import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
import { decodeJwtToken } from "../../utils/decodeToken";

import {
    Calendar,
    Search,
    FileText,
    Building2,
    ArrowLeft,
    Download,
    Filter,
    AlertCircle,
    CheckCircle,
    Clock,
    MapPin,
    Phone,
    User,
    Eye,
    TrendingUp,
    Loader2,
    RefreshCw,
} from "lucide-react";

interface PaymentReport {
    survey_id: string;
    survey_date: string;
    application_number: string;
    haat_id: string;
    haat_name: string;
    shop_owner_name?: string;
    mobile_number?: string;
    survey_status?: string;
    license_type?: string;
    shopowner_name?: string;
    initial_payment_amount?: string;
    initial_payment_date?: string;
    approved_date?: string;
    approved_amount?: string;
    approved_by?: string;
    approved_rermarks?: string;
}

interface ApiResponse {
    status: number;
    message: string;
    data: PaymentReport[];
}

interface ReportsProps {
    onBack?: () => void;
}

const Reports: React.FC<ReportsProps> = ({ onBack }) => {
    const [reportData, setReportData] = useState<PaymentReport[]>([]);
    const [filteredData, setFilteredData] = useState<PaymentReport[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedFilter, setSelectedFilter] = useState<string>("all");

    const formatDateForInput = (date: Date): string => {
        return date.toISOString().split("T")[0];
    };

    const formatDateForAPI = (dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // ✅ API call
    const fetchReportData = useCallback(async () => {
        if (!fromDate || !toDate) return;

        setLoading(true);
        setError(null);

        try {
            const token = Cookies.get("token");
            if (!token) {
                setError("Authentication token not found. Please login again.");
                setLoading(false);
                return;
            }

            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestBody = {
                from_date: formatDateForAPI(fromDate),
                to_date: formatDateForAPI(toDate),
                user_id: decodeJwtToken()?.UserID,
            };

            const response = await fetch(
                `${BASE_API_URL}user/getReportingDetailsForLicenseGenerated`,
                {
                    method: "POST",
                    headers: myHeaders,
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result: ApiResponse = await response.json();

            if (result.status === 0 && Array.isArray(result.data)) {
                setReportData(result.data);
            } else {
                setReportData([]);
                setError(result.message || "Failed to fetch reports");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
            setReportData([]);
        } finally {
            setLoading(false);
        }
    }, [fromDate, toDate]);

    // ✅ Set default date range on mount
    useEffect(() => {
        const today = new Date();
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        setFromDate(formatDateForInput(firstDayOfYear));
        setToDate(formatDateForInput(today));
    }, []);

    // ✅ Re-fetch data when dates change
    useEffect(() => {
        if (fromDate && toDate) {
            fetchReportData();
        }
    }, [fromDate, toDate, fetchReportData]);

    // ✅ Filter records
    useEffect(() => {
        let filtered = reportData;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                Object.values(item).some(val =>
                    String(val ?? "").toLowerCase().includes(term)
                )
            );
        }

        if (selectedFilter !== "all") {
            filtered = filtered.filter((item) => item.survey_status === selectedFilter);
        }

        setFilteredData(filtered);
    }, [reportData, searchTerm, selectedFilter]);

    const handleSearch = () => {
        fetchReportData();
    };

    const formatDisplayDate = (dateString: string): string => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    const formatCurrency = (amount: string): string => {
        if (!amount || amount === "-") return "-";
        return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 rounded-lg shadow-md">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Payment Reports</h1>
                                <p className="text-gray-600 mt-1">Track and manage payment transactions</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
                            <Clock className="w-4 h-4" />
                            <span>Last updated: {new Date().toLocaleDateString("en-IN")}</span>
                        </div>
                    </div>
                </div>

                {/* Filters Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-white" />
                            <h2 className="text-lg font-semibold text-white">Filter Reports</h2>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    Search
                                </label>
                                <input
                                    type="text"
                                    placeholder="Application no., Haat name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Action</label>
                                <button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-4 h-4" />
                                            Search Reports
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500 rounded-lg">
                                        <FileText className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-green-700 font-medium">Total Records</p>
                                        <p className="text-2xl font-bold text-green-800">{filteredData.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500 rounded-lg">
                                        <TrendingUp className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-700 font-medium">Total Amount</p>
                                        <p className="text-2xl font-bold text-blue-800">
                                            ₹{filteredData.reduce((sum, item) => sum + (parseFloat(item.initial_payment_amount || '0') || 0), 0).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500 rounded-lg">
                                        <Building2 className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-700 font-medium">Unique Haats</p>
                                        <p className="text-2xl font-bold text-purple-800">
                                            {new Set(filteredData.map(item => item.haat_name)).size}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Toast */}
                {/* {error && (
          <div className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <span className="font-semibold">Error:</span> {error}
            </div>
          </div>
        )} */}

                {/* Data Table Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-white" />
                                <h2 className="text-lg font-semibold text-white">Payment Records</h2>
                            </div>
                            {/* <button className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200">
                <Download className="w-4 h-4" />
                Export
              </button> */}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Application No.
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Survey Date
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            Haat Name
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Shop Owner
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Mobile
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Approved Date
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4" />
                                            Approved By
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4" />
                                            Approved Remarks
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredData.length > 0 ? (
                                    filteredData.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                                    <span className="font-medium text-gray-900">{row.application_number || "-"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{formatDisplayDate(row.survey_date)}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-900">{row.haat_name || "-"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{row.shopowner_name || "-"}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-700">{row.mobile_number || "-"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{row.approved_date || "-"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{row.approved_by || "-"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{row.approved_rermarks || "-"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                                        <p className="text-gray-500 font-medium">Loading reports...</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <FileText className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-medium text-gray-900 mb-1">No records found</p>
                                                            <p className="text-gray-500">Try adjusting your filters or date range</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                {filteredData.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-500 bg-white rounded-lg p-4 shadow-sm">
                        Showing {filteredData.length} of {reportData.length} records
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;