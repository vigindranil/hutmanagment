import React, { useEffect, useState } from "react";
import { decodeJwtToken } from "../utils/decodeToken";
import { Calendar, Search, FileText, User, MapPin, Phone, Building2, Eye, AlertCircle } from "lucide-react";

const BASE_API_URL = "http://150.241.245.34/HMSRestAPI/api/";

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
}

interface ApiResponse {
  status: number;
  message: string;
  data: PaymentReport[];
}

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<PaymentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // Set default dates on component mount
  useEffect(() => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    
    setFromDate(formatDateForInput(firstDayOfYear));
    setToDate(formatDateForInput(today));
  }, []);

  // Fetch data when component mounts and dates are set
  useEffect(() => {
    if (fromDate && toDate) {
      fetchReportData();
    }
  }, [fromDate, toDate]);

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatDateForAPI = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchReportData = async () => {
    if (!fromDate || !toDate) {
      setError("Please select both from and to dates");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get token from decodeJwtToken
      const userDetails = decodeJwtToken();
      const token = userDetails?.token;
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append("accept", "*/*");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestBody = {
        from_date: formatDateForAPI(fromDate),
        to_date: formatDateForAPI(toDate),
        user_id: userDetails?.user_id,
      };

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(requestBody),
        redirect: "follow" as RequestRedirect,
      };

      const response = await fetch(
        `${BASE_API_URL}user/getReportingDetailsForFirstPaymentCompleted`,
        requestOptions
      );

    //   if (!response.ok) {
    //     throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    //   }

      const result: ApiResponse = await response.json();
      
      if (result.status === 0 && Array.isArray(result.data)) {
        setReportData(result.data);
      } else {
        setReportData([]);
        if (result.message) {
          setError(result.message);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch data");
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchReportData();
  };

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Payment Completion Reports
              </h1>
              <p className="text-gray-600 mt-1">
                Track and monitor first payment completed applications
              </p>
            </div>
          </div>

          {/* Filter Section */}
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  From Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  To Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 opacity-0">
                  Action
                </label>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                  {loading ? "Searching..." : "Search Reports"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-800 font-medium">Error</p>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )} */}

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">
              Payment Reports ({reportData.length} records)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border-r border-blue-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Survey Date
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border-r border-blue-500">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Application Number
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border-r border-blue-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Haat ID
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Haat Name
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600 font-medium">Loading reports...</p>
                      </div>
                    </td>
                  </tr>
                ) : reportData.length > 0 ? (
                  reportData.map((row, index) => (
                    <tr 
                      key={`${row.survey_id}-${index}`}
                      className="hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatDisplayDate(row.survey_date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {row.application_number || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {row.haat_id || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {row.haat_name || "-"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-gray-100 rounded-full">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-medium">No payment reports found</p>
                        <p className="text-gray-500 text-sm">
                          Try adjusting your date range or search criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Card */}
        {reportData.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {reportData.length}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Total Records
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {new Set(reportData.map(r => r.haat_id)).size}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Unique Haats
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {new Set(reportData.map(r => r.application_number)).size}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Unique Applications
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;