import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSurveyDetailsForMakerByBoundaryID } from '../surveyAPI/surveyAPI';
import { decodeJwtToken } from '../../utils/decodeToken';
import {
    FileText,
    Search,
    Filter,
    RefreshCw,
    MapPin,
    User,
    Phone,
    FileCheck,
    IndianRupee,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface SurveyData {
    application_number: string;
    police_station_name: string;
    block_name: string;
    mouza_name: string;
    municipality_name: string;
    ward_no: string;
    haat_name: string;
    shop_owner_name: string;
    address: string;
    mobile_number: string;
    document_type: string;
    document_number: string;
    land_valuation_amount: string;
}

const PAGE_SIZE = 10;

const MakerSurveyTable: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [surveyData, setSurveyData] = useState<SurveyData[]>([]);
    const [filteredData, setFilteredData] = useState<SurveyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    // Initialize dates (YYYY-MM-DD for input fields)
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 1);
        return d.toISOString().split('T')[0];
    });

    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    const statusId = searchParams.get('_hti') || '1';
    const title = searchParams.get('title') || 'Survey Details';

    useEffect(() => {
        fetchSurveyData();
    }, [statusId, startDate, endDate]);

    useEffect(() => {
        // Filter data based on search term
        if (searchTerm.trim() === '') {
            setFilteredData(surveyData);
            setCurrentPage(1); // Reset to page 1 on data/filter change
        } else {
            const filtered = surveyData.filter((item) =>
                Object.values(item).some((value) =>
                    value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredData(filtered);
            setCurrentPage(1); // Reset to page 1 on search
        }
    }, [searchTerm, surveyData]);

    // When filteredData changes, ensure page isn't out of bounds
    useEffect(() => {
        const maxPage = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
        if (currentPage > maxPage) {
            setCurrentPage(maxPage);
        }
    }, [filteredData, currentPage]);

    const fetchSurveyData = async () => {
        try {
            setLoading(true);
            setError(null);
            const userDetails = decodeJwtToken();

            // Extract values from token with fallback
            const boundaryLevelId = userDetails?.BoundaryLevelID || 2;
            const boundaryId = userDetails?.BoundaryID || 9;

            // Convert YYYY-MM-DD to DD-MM-YYYY for API
            const formatDateForApi = (dateStr: string) => {
                if (!dateStr) return '';
                const [year, month, day] = dateStr.split('-');
                return `${day}-${month}-${year}`;
            };

            const data = await getSurveyDetailsForMakerByBoundaryID(
                boundaryLevelId,
                boundaryId,
                parseInt(statusId),
                formatDateForApi(startDate),
                formatDateForApi(endDate)
            );

            setSurveyData(data);
            setFilteredData(data);
            setCurrentPage(1); // Reset to page 1
        } catch (err) {
            console.error('Error fetching survey data:', err);
            setError('Failed to load survey data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Pagination logic - indices for the current page
    const totalItems = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const paginatedData = filteredData.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    // Pagination controls
    const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
    const handleGotoPage = (n: number) => setCurrentPage(n);

    const Pagination = () => (
        <div className="flex justify-center items-center mt-6 gap-2">
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-md border bg-white border-gray-200 text-gray-600 hover:bg-sky-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                aria-label="Previous Page"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            {/* Show page numbers, compact if too many pages */}
            {Array.from({ length: totalPages }).map((_, i) => {
                // For >6 pages, show: 1 ... N-1 N for end, middle, etc.
                if (totalPages <= 6 ||
                    Math.abs(i + 1 - currentPage) <= 1 ||
                    i === 0 ||
                    i === totalPages - 1
                ) {
                    return (
                        <button
                            key={i}
                            onClick={() => handleGotoPage(i + 1)}
                            className={`px-3 py-1 rounded-md border ${currentPage === i + 1
                                ? 'bg-sky-500 text-white border-sky-500'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-sky-100'
                                } font-semibold transition-all`}
                            disabled={currentPage === i + 1}
                        >
                            {i + 1}
                        </button>
                    );
                }
                // Ellipsis logic
                if (
                    (i === 1 && currentPage > 4) ||
                    (i === totalPages - 2 && currentPage < totalPages - 3)
                ) {
                    return (
                        <span key={i} className="px-2 text-gray-400 select-none">
                            ...
                        </span>
                    );
                }
                return null;
            })}
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border bg-white border-gray-200 text-gray-600 hover:bg-sky-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                aria-label="Next Page"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
            <span className="ml-4 text-xs text-gray-500">
                Page {currentPage} of {totalPages}
            </span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 p-6">
            <div className="max-w-[98%] mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-sky-200/50 p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-start gap-5">
                            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/30">
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">
                                    {title}
                                </h1>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-100 rounded-lg border border-sky-200">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="text-gray-600">Total:</span>
                                        <span className="font-bold text-gray-800">{surveyData.length}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-lg border border-blue-200">
                                        <span className="text-gray-600">Showing:</span>
                                        <span className="font-bold text-blue-600">{filteredData.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={fetchSurveyData}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-sky-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            <RefreshCw className={`w-8 h-8 ${loading ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </button>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-sky-200/50 p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity blur"></div>
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                            <input
                                type="text"
                                placeholder="Search applications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="relative w-full pl-12 pr-4 py-4 bg-sky-50/50 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all text-sm"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex flex-col min-w-[170px]">
                                <label className="text-xs font-bold text-gray-600 mb-2 ml-1 uppercase tracking-wider">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-4 py-3.5 bg-sky-50/50 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent text-gray-800 transition-all text-sm"
                                />
                            </div>
                            <div className="flex flex-col min-w-[170px]">
                                <label className="text-xs font-bold text-gray-600 mb-2 ml-1 uppercase tracking-wider">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-4 py-3.5 bg-sky-50/50 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent text-gray-800 transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modern Card-Based Table */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-sky-200/50 p-24">
                            <div className="flex flex-col items-center justify-center">
                                <div className="relative w-20 h-20">
                                    <div className="absolute inset-0 rounded-full border-4 border-sky-200"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-500 border-r-blue-500 animate-spin"></div>
                                </div>
                                <p className="mt-6 text-gray-600 font-semibold text-lg">Loading survey data...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-sky-200/50 p-24">
                            <div className="flex items-center justify-center">
                                <div className="text-center max-w-md">
                                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-200">
                                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <p className="text-red-600 font-bold text-xl mb-3">Error Loading Data</p>
                                    <p className="text-gray-600 mb-8">{error}</p>
                                    <button
                                        onClick={fetchSurveyData}
                                        className="px-8 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-sky-500/50 font-semibold"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-sky-200/50 p-24">
                            <div className="flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-sky-200">
                                        <Filter className="w-12 h-12 text-sky-400" />
                                    </div>
                                    <p className="text-gray-800 font-bold text-xl mb-3">No Applications Found</p>
                                    <p className="text-gray-500">
                                        {searchTerm ? 'Try adjusting your search criteria or date range' : 'No data available for the selected period'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {paginatedData.map((row, index) => (
                                <div
                                    key={index + (currentPage - 1) * PAGE_SIZE}
                                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-sky-200/50 p-6 hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-300 hover:border-sky-400/50 group"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {/* Header: Application No, Name, and Land Valuation */}
                                        <div className="lg:col-span-4 pb-4 border-b border-sky-200/50">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                                <div className="flex flex-wrap items-center gap-8">
                                                    {/* Application Identity */}
                                                    <div className="space-y-1.5">
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            Application No.
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-600 rounded-lg shadow-md shadow-blue-500/20">
                                                                <span className="text-white font-bold text-sm">
                                                                    {row.application_number || 'N/A'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Applicant Name */}
                                                    <div className="space-y-1.5">
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            Shop Owner Name
                                                        </div>
                                                        <div className="flex items-center gap-2.5 text-gray-800">
                                                            <div className="p-1.5 bg-blue-50 rounded-lg">
                                                                <User className="w-4 h-4 text-blue-500" />
                                                            </div>
                                                            <span className="font-bold text-lg tracking-tight">
                                                                {row.shop_owner_name || 'Not Specified'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Land Valuation */}
                                                <div className="flex flex-col items-start sm:items-end space-y-1">
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        Land Valuation
                                                    </div>
                                                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50/50 px-4 py-2 rounded-xl border border-blue-100">
                                                        <IndianRupee className="w-5 h-5 text-blue-600" />
                                                        <span className="text-2xl font-black tracking-tighter">
                                                            {row.land_valuation_amount || '0'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile Number */}
                                        <div className="space-y-2 mt-2">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                                <Phone className="w-4 h-4" />
                                                Mobile Number
                                            </div>
                                            <div className="text-gray-700 font-mono text-base">
                                                {row.mobile_number || '-'}
                                            </div>
                                        </div>

                                        {/* Police Station */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                                <MapPin className="w-4 h-4" />
                                                Police Station
                                            </div>
                                            <div className="text-gray-700 text-base">
                                                {row.police_station_name || '-'}
                                            </div>
                                        </div>

                                        {/* Document Info */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                                <FileCheck className="w-4 h-4" />
                                                Document
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold border border-indigo-200">
                                                    {row.document_type || '-'}
                                                </span>
                                                <span className="text-gray-600 text-sm font-mono">
                                                    {row.document_number || '-'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Location Details */}
                                        <div className="lg:col-span-2 space-y-2">
                                            <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                                Location Details
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Block:</span>
                                                    <span className="text-gray-700 ml-2">{row.block_name || '-'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Mouza:</span>
                                                    <span className="text-gray-700 ml-2">{row.mouza_name || '-'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Municipality:</span>
                                                    <span className="text-gray-700 ml-2">{row.municipality_name || '-'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Ward:</span>
                                                    <span className="text-gray-700 ml-2">{row.ward_no || '-'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address & Haat */}
                                        <div className="lg:col-span-2 space-y-3">
                                            <div>
                                                <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                                                    Address
                                                </div>
                                                <div className="text-gray-700 text-sm">
                                                    {row.address || '-'}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 text-xs">Haat:</span>
                                                <span className="text-gray-700 text-sm ml-2">{row.haat_name || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination Controls */}
                            <Pagination />
                        </>
                    )}
                </div>

                {/* Footer Stats */}
                {!loading && !error && filteredData.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-sky-200/50 px-6 py-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                                <span className="text-gray-600">
                                    Displaying{' '}
                                    <span className="font-bold text-gray-800">
                                        {(currentPage - 1) * PAGE_SIZE + 1}
                                    </span>
                                    {' - '}
                                    <span className="font-bold text-gray-800">
                                        {Math.min(currentPage * PAGE_SIZE, filteredData.length)}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-bold text-gray-800">
                                        {surveyData.length}
                                    </span>{' '}
                                    applications
                                </span>
                            </div>
                            <span className="text-xs text-gray-500">
                                Last updated: {new Date().toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MakerSurveyTable;
