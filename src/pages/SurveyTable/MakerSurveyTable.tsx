import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSurveyDetailsForMakerByBoundaryID, updateSurveyDetailsByMaker, MakerUploadFiles } from '../surveyAPI/surveyAPI';
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
    ChevronRight,
    Edit,
    Save,
    X,
    Upload,
    CheckCircle
} from 'lucide-react';

// You can expand this as needed for typing each field deeply
interface ExtendedSurveyData {
    survey_id?: string;
    application_number: string;
    // All new fields for data edit modal, type according to the prompt
    license_type: number;
    application_status: number;
    applicant_type: number;
    usage_type: number;
    active_status: number;
    name: string;
    guardian_name: string;
    address: string;
    mobile: string;
    citizenship: string;
    pin_code: number;
    is_within_family: number;
    transfer_relationship: number;
    document_type: string;
    document_no: string;
    pan: string;
    previous_license_no: string;
    license_expiry_date: string | null;
    property_tax_payment_to_year: number;
    land_transfer_explanation: string;
    occupy: number;
    occupy_from_year: number;
    present_occupier_name: string;
    occupier_guardian_name: string;
    adsr_name: string;
    is_same_owner: number;
    rented_to_whom: string | null;
    district_id: number;
    block_municipality_type: number;
    block_municipality_id: number;
    village_ward_id: number;
    police_station_id: number;
    hat_id: number;
    mouza_id: number;
    stall_no: string;
    holding_no: string;
    jl_no: string;
    khatian_no: string;
    plot_no: string;
    area_com_sqft: number;
    latitude: number;
    longitude: number;
    land_valuation_amount: number;
    remarks: string;
    hearing_date: string | null;
    hearing_approved_date: string | null;
    hearing_remarks: string;
    hearing_approved_by: string;
    approval_remarks: string;
    approval_date: string | null;
    survey_approved_by: string;
    initial_amount: number;
    final_amount: number;
    initial_payment_status: number;
    final_payment_status: number;
    initial_payment_date: string | null;
    final_payment_date: string | null;
    // Also old fields if needed for table display
    police_station_name?: string;
    police_district_name?: string;
    block_name?: string;
    mouza_name?: string;
    municipality_name?: string;
    ward_no?: string;
    haat_name?: string;
    shop_owner_name?: string;
    mobile_number?: string;
    document_number?: string;
    // add other table fields as needed
}

const PAGE_SIZE = 10;

const ALL_EDIT_FIELDS: { key: keyof ExtendedSurveyData, label: string, type: string }[] = [
    // { key: "license_type", label: "License Type", type: "number" },
    // { key: "application_status", label: "Application Status", type: "number" },
    // { key: "applicant_type", label: "Applicant Type", type: "number" },
    // { key: "usage_type", label: "Usage Type", type: "number" },
    // { key: "active_status", label: "Active Status", type: "number" },
    { key: "name", label: "Name", type: "text" },
    { key: "guardian_name", label: "Guardian Name", type: "text" },
    { key: "address", label: "Address", type: "text" },
    { key: "mobile", label: "Mobile", type: "text" },
    { key: "citizenship", label: "Citizenship", type: "text" },
    { key: "pin_code", label: "Pin Code", type: "number" },
    { key: "is_within_family", label: "Is Within Family", type: "number" },
    { key: "transfer_relationship", label: "Transfer Relationship", type: "number" },
    { key: "document_type", label: "Document Type", type: "text" },
    { key: "document_no", label: "Document Number", type: "text" },
    { key: "pan", label: "PAN", type: "text" },
    { key: "previous_license_no", label: "Previous License No", type: "text" },
    { key: "license_expiry_date", label: "License Expiry Date", type: "date" },
    { key: "property_tax_payment_to_year", label: "Property Tax Payment To Year", type: "number" },
    { key: "land_transfer_explanation", label: "Land Transfer Explanation", type: "text" },
    { key: "occupy", label: "Occupy", type: "number" },
    { key: "occupy_from_year", label: "Occupy From Year", type: "number" },
    { key: "present_occupier_name", label: "Present Occupier Name", type: "text" },
    { key: "occupier_guardian_name", label: "Occupier Guardian Name", type: "text" },
    { key: "adsr_name", label: "ADSR Name", type: "text" },
    { key: "is_same_owner", label: "Is Same Owner", type: "number" },
    { key: "rented_to_whom", label: "Rented To Whom", type: "text" },
    { key: "district_id", label: "District ID", type: "number" },
    { key: "block_municipality_type", label: "Block/Municipality Type", type: "number" },
    { key: "block_municipality_id", label: "Block/Municipality ID", type: "number" },
    { key: "village_ward_id", label: "Village/Ward ID", type: "number" },
    { key: "police_station_id", label: "Police Station ID", type: "number" },
    { key: "hat_id", label: "Hat ID", type: "number" },
    { key: "mouza_id", label: "Mouza ID", type: "number" },
    { key: "stall_no", label: "Stall No", type: "text" },
    { key: "holding_no", label: "Holding No", type: "text" },
    { key: "jl_no", label: "JL No", type: "text" },
    { key: "khatian_no", label: "Khatian No", type: "text" },
    { key: "plot_no", label: "Plot No", type: "text" },
    { key: "area_com_sqft", label: "Area (Sqft)", type: "number" },
    { key: "latitude", label: "Latitude", type: "number" },
    { key: "longitude", label: "Longitude", type: "number" },
    { key: "land_valuation_amount", label: "Land Valuation Amount", type: "number" },
    { key: "remarks", label: "Remarks", type: "text" },
    // { key: "hearing_date", label: "Hearing Date", type: "date" },
    // { key: "hearing_approved_date", label: "Hearing Approved Date", type: "date" },
    // { key: "hearing_remarks", label: "Hearing Remarks", type: "text" },
    // { key: "hearing_approved_by", label: "Hearing Approved By", type: "text" },
    // { key: "approval_remarks", label: "Approval Remarks", type: "text" },
    // { key: "approval_date", label: "Approval Date", type: "date" },
    // { key: "survey_approved_by", label: "Survey Approved By", type: "text" },
    // { key: "initial_amount", label: "Initial Amount", type: "number" },
    // { key: "final_amount", label: "Final Amount", type: "number" },
    // { key: "initial_payment_status", label: "Initial Payment Status", type: "number" },
    // { key: "final_payment_status", label: "Final Payment Status", type: "number" },
    // { key: "initial_payment_date", label: "Initial Payment Date", type: "date" },
    // { key: "final_payment_date", label: "Final Payment Date", type: "date" }
];

const MakerSurveyTable: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [surveyData, setSurveyData] = useState<ExtendedSurveyData[]>([]);
    const [filteredData, setFilteredData] = useState<ExtendedSurveyData[]>([]);
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

    // Edit Modal State
    const [editingSurvey, setEditingSurvey] = useState<ExtendedSurveyData | null>(null);
    const [editFields, setEditFields] = useState<Partial<ExtendedSurveyData>>({});
    const [uploadFiles, setUploadFiles] = useState<MakerUploadFiles>({});
    const [isSaving, setIsSaving] = useState(false);

    const handleEditClick = (survey: ExtendedSurveyData) => {
        setEditingSurvey(survey);
        // Set defaults to show in the edit form (fall back to blank/0 as in prompt)
        setEditFields({
            ...Object.fromEntries(
                ALL_EDIT_FIELDS.map(f => [
                    f.key,
                    survey[f.key] !== undefined && survey[f.key] !== null
                        ? survey[f.key]
                        : (f.type === 'text' ? '' : f.type === 'date' ? null : 0)
                ])
            )
        });
        setUploadFiles({});
    };

    // Field (text/number/date) change
    const handleFieldChange = (key: keyof ExtendedSurveyData, value: any) => {
        setEditFields(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // File change handler for uploads
    const handleFileChange = (key: keyof MakerUploadFiles, file: File | null) => {
        if (file) {
            setUploadFiles(prev => ({ ...prev, [key]: file }));
        } else {
            setUploadFiles(prev => {
                const newFiles = { ...prev };
                delete newFiles[key];
                return newFiles;
            });
        }
    };

    const handleSave = async () => {
        if (!editingSurvey || !editingSurvey.survey_id) return;

        try {
            setIsSaving(true);
            const userDetails = decodeJwtToken();
            // Compose the payload using all edit fields, survey_id and maker_id (plus any additional required)
            const payload = {
                ...editFields,
                survey_id: editingSurvey.survey_id,
                maker_id: userDetails?.UserID
            };
            await updateSurveyDetailsByMaker(uploadFiles, payload);

            // Success feedback and close modal
            alert('Survey details updated successfully!');
            setEditingSurvey(null);
            setEditFields({});
            setUploadFiles({});
            fetchSurveyData(); // Refresh data
        } catch (error) {
            console.error('Error updating survey:', error);
            alert('Failed to update survey details.');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchSurveyData();
    }, [statusId, startDate, endDate]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredData(surveyData);
            setCurrentPage(1);
        } else {
            const lower = searchTerm.toLowerCase();
            const filtered = surveyData.filter((item) =>
                Object.values(item).some((value) =>
                    value !== undefined && value !== null && value.toString().toLowerCase().includes(lower)
                )
            );
            setFilteredData(filtered);
            setCurrentPage(1);
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
            setCurrentPage(1);
        } catch (err) {
            console.error('Error fetching survey data:', err);
            setError('Failed to load survey data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Pagination logic
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
            {Array.from({ length: totalPages }).map((_, i) => {
                if (
                    totalPages <= 6 ||
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
                                    <p className="text-gray-500">{searchTerm ? 'Try adjusting your search criteria or date range' : 'No data available for the selected period'}</p>
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
                                        <div className="lg:col-span-4 pb-4 border-b border-sky-200/50">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                                <div className="flex flex-wrap items-center gap-8">
                                                    <div className="space-y-1.5">
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            Application No.
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-600 rounded-lg shadow-md shadow-blue-500/20">
                                                                <span className="text-white font-bold text-sm">
                                                                    {(row.application_number || 'N/A')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            Shop Owner Name
                                                        </div>
                                                        <div className="flex items-center gap-2.5 text-gray-800">
                                                            <div className="p-1.5 bg-blue-50 rounded-lg">
                                                                <User className="w-4 h-4 text-blue-500" />
                                                            </div>
                                                            <span className="font-bold text-lg tracking-tight">
                                                                {(row.shop_owner_name || row.name || 'Not Specified')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-start sm:items-end space-y-1">
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        Land Valuation
                                                    </div>
                                                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50/50 px-4 py-2 rounded-xl border border-blue-100">
                                                        <IndianRupee className="w-5 h-5 text-blue-600" />
                                                        <span className="text-2xl font-black tracking-tighter">
                                                            {Number(row.land_valuation_amount || 0).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mt-2">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                                <Phone className="w-4 h-4" />
                                                Mobile Number
                                            </div>
                                            <div className="text-gray-700 font-mono text-base">
                                                {row.mobile_number || row.mobile || '-'}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                                <MapPin className="w-4 h-4" />
                                                Police Station
                                            </div>
                                            <div className="text-gray-700 text-base">
                                                {row.police_station_name || '-'}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                                <FileCheck className="w-4 h-4" />
                                                Document
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold border border-indigo-200">
                                                    {row.document_type === '1'
                                                        ? 'Aadhar'
                                                        : row.document_type === '2'
                                                            ? 'Voter'
                                                            : row.document_type || '-'}
                                                </span>
                                                <span className="text-gray-600 text-sm font-mono">
                                                    {row.document_number || row.document_no || '-'}
                                                </span>
                                            </div>
                                        </div>
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
                                                <div>
                                                    <span className="text-gray-500">District Name:</span>
                                                    <span className="text-gray-700 ml-2">{row.police_district_name || '-'}</span>
                                                </div>
                                            </div>
                                        </div>
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
                                    <div className="flex justify-end pt-4 border-t border-sky-100 mt-4">
                                        {statusId === '2' && (
                                            <button
                                                onClick={() => handleEditClick(row)}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-indigo-500/30 font-medium"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit Details
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <Pagination />
                            {editingSurvey && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800">Edit Survey Details</h2>
                                                <p className="text-sm text-gray-500 mt-1">Application No: <span className="font-mono font-medium text-gray-700">{editingSurvey.application_number}</span></p>
                                            </div>
                                            <button
                                                onClick={() => setEditingSurvey(null)}
                                                className="p-2 hover:bg-gray-200/50 rounded-full transition-colors"
                                            >
                                                <X className="w-6 h-6 text-gray-500" />
                                            </button>
                                        </div>
                                        <div className="p-8 overflow-y-auto custom-scrollbar">
                                            <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    {ALL_EDIT_FIELDS.map(field => (
                                                        <div key={String(field.key)} className="mb-1">
                                                            <label className="block text-sm font-bold text-gray-600 mb-2">
                                                                {field.label}
                                                            </label>
                                                            {field.type === "date" ? (
                                                                <input
                                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
                                                                    type="date"
                                                                    value={editFields[field.key] ? String(editFields[field.key]).slice(0, 10) : ""}
                                                                    onChange={e =>
                                                                        handleFieldChange(
                                                                            field.key,
                                                                            e.target.value === "" ? null : e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            ) : (
                                                                <input
                                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
                                                                    type={field.type}
                                                                    value={
                                                                        // numbers may be 0 and blanks allowed for text
                                                                        (editFields[field.key] !== undefined && editFields[field.key] !== null)
                                                                            ? editFields[field.key]
                                                                            : (field.type === "number" ? 0 : "")
                                                                    }
                                                                    onChange={e =>
                                                                        handleFieldChange(
                                                                            field.key,
                                                                            field.type === "number"
                                                                                ? (e.target.value === ""
                                                                                    ? 0
                                                                                    : Number(e.target.value))
                                                                                : e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* File upload fields (from previous code) */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                                                    {[
                                                        { key: 'documentImage', label: 'Document Image' },
                                                        { key: 'panImage', label: 'PAN Card Image' },
                                                        { key: 'residentialCertificateAttached', label: 'Residential Certificate' },
                                                        { key: 'tradeLicenseAttached', label: 'Trade License' },
                                                        { key: 'affidavitAttached', label: 'Affidavit' },
                                                        { key: 'warisionCertificateAttached', label: 'Warision Certificate' },
                                                        { key: 'deathCertificateAttached', label: 'Death Certificate' },
                                                        { key: 'nocLegalHeirsAttached', label: 'NOC Legal Heirs' },
                                                        { key: 'landValuationDoc', label: 'Land Valuation Doc' },
                                                        { key: 'sketchMapAttached', label: 'Sketch Map' },
                                                        { key: 'stallImage1', label: 'Stall Image 1' },
                                                        { key: 'stallImage2', label: 'Stall Image 2' },
                                                    ].map((field) => (
                                                        <div key={field.key} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-colors group">
                                                            <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors">
                                                                {field.label}
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    type="file"
                                                                    id={field.key}
                                                                    className="hidden"
                                                                    onChange={(e) => handleFileChange(field.key as keyof MakerUploadFiles, e.target.files ? e.target.files[0] : null)}
                                                                    accept="image/*,.pdf"
                                                                />
                                                                <label
                                                                    htmlFor={field.key}
                                                                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${uploadFiles[field.key as keyof MakerUploadFiles]
                                                                        ? 'border-emerald-400 bg-emerald-50'
                                                                        : 'border-gray-300 bg-white hover:bg-sky-50 hover:border-sky-400'
                                                                        }`}
                                                                >
                                                                    {uploadFiles[field.key as keyof MakerUploadFiles] ? (
                                                                        <div className="flex flex-col items-center text-emerald-600">
                                                                            <CheckCircle className="w-8 h-8 mb-2" />
                                                                            <span className="text-xs font-semibold text-center px-2 truncate w-full max-w-[180px]">
                                                                                {(uploadFiles[field.key as keyof MakerUploadFiles] as File).name}
                                                                            </span>
                                                                            <span className="text-[10px] opacity-70 mt-1">Click to change</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex flex-col items-center text-gray-500 group-hover:text-sky-500">
                                                                            <Upload className="w-8 h-8 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                                            <span className="text-xs font-semibold">Click to upload</span>
                                                                        </div>
                                                                    )}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-end gap-3 mt-8">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingSurvey(null)}
                                                        className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isSaving}
                                                        className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {isSaving ? (
                                                            <>
                                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save className="w-4 h-4" />
                                                                Save Changes
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                {
                    !loading && !error && filteredData.length > 0 && (
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
                    )
                }
            </div>
        </div>
    );
};

export default MakerSurveyTable;
