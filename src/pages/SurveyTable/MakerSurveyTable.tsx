import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    getSurveyDetailsForMakerByBoundaryID,
    updateSurveyDetailsByMaker,
    MakerUploadFiles,
    getRelationshipDetails,
    getMouzaListByPoliceStationID,
    getJLNoByPoliceStationID,
    getADSRNameByPoliceStationID,
    getAllHaatDetailsByDistrictID,
    getThanaListByDistrictID,
    getBoundaryDetailsByBoundaryID,
} from '../../Service/surveyAPI';
import { commonApiImage } from '../../Service/surveyAPI';
import { decodeJwtToken } from '../../utils/decodeToken';
import Swal from 'sweetalert2';
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
    CheckCircle,
    Eye
} from 'lucide-react';

// Helper to open blob in new window
const openBlobInNewWindow = (val: string) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Image Viewer</title>
                <style>
                    body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #000; }
                    img { max-width: 100%; max-height: 100vh; object-fit: contain; }
                </style>
            </head>
            <body>
                <img src="${val}" alt="Image" />
            </body>
            </html>
        `);
        newWindow.document.close();
    }
};

interface DesignableModalProps {
    show: boolean;
    onClose: () => void;
    isLoading: boolean;
    details: any;
}

// ---- Redesigned View Survey Modal ----
const DesignableModal = React.memo(({ show, onClose, isLoading, details }: DesignableModalProps) => {
    const [activeTab, setActiveTab] = useState(0);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    useEffect(() => {
        if (show) {
            setActiveTab(0);
            setLightboxSrc(null);
        }
    }, [show]);

    if (!show) return null;

    const tabs = [
        { label: 'Overview', icon: '📋' },
        { label: 'Personal', icon: '👤' },
        { label: 'Location', icon: '📍' },
        { label: 'Property', icon: '🏠' },
        { label: 'Documents', icon: '📎' },
    ];

    const prettyLabels: Record<string, string> = {
        survey_date: "Survey Date",
        application_number: "Application Number",
        police_district_name: "Police District",
        police_station_name: "Police Station",
        block_name: "Block",
        mouza_name: "Mouza",
        municipality_name: "Municipality",
        ward_no: "Ward No",
        haat_name: "Haat Name",
        name: "Owner Name",
        address: "Address",
        mobile: "Mobile",
        document_number: "Document Number",
        land_valuation_amount: "Land Valuation",
        guardian_name: "Guardian Name",
        citizenship: "Citizenship",
        pin_code: "Pin Code",
        land_transfer_explanation: "Transfer Explanation",
        previous_license_no: "Previous License No",
        license_expiry_date: "License Expiry Date",
        property_tax_payment_to_year: "Tax Payment Year",
        occupy: "Is Occupied",
        occupy_from_year: "Occupied From Year",
        present_occupier_name: "Present Occupier",
        occupier_guardian_name: "Occupier Guardian",
        document_image: "Document Image",
        pan: "PAN",
        pan_image: "PAN Image",
        residential_certificate_attached: "Residential Certificate",
        trade_license_attached: "Trade License",
        affidavit_attached: "Affidavit",
        adsr_name: "ADSR Name",
        warision_certificate_attached: "Warision Certificate",
        death_certificate_attached: "Death Certificate",
        noc_legal_heirs_attached: "NOC Legal Heirs",
        is_with_in_family: "Within Family Transfer",
        transfer_relationship: "Transfer Relationship",
        is_same_owner: "Is Same Owner",
        rented_to_whom: "Rented To",
        stall_no: "Stall No",
        holding_no: "Holding No",
        jl_no: "JL No",
        khatian_no: "Khatian No",
        plot_no: "Plot No",
        area_dom_sqft: "Domestic Area (Sqft)",
        area_com_sqft: "Commercial Area (Sqft)",
        direction: "Direction",
        latitude: "Latitude",
        longitude: "Longitude",
        sketch_map_attached: "Sketch Map",
        stall_image1: "Stall Image 1",
        stall_image2: "Stall Image 2",
    };

    const isAttachment = (f: string) =>
        f.endsWith("attached") || f.endsWith("image") ||
        ["sketch_map_attached", "stall_image1", "stall_image2"].includes(f);

    const renderAttachment = (val: any, label: string) => {
        if (!val) return (
            <div className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 gap-2">
                <span className="text-2xl">📄</span>
                <span className="text-xs font-medium">No file attached</span>
            </div>
        );
        const isImage = typeof val === 'string' && (
            val.startsWith('blob:') || val.startsWith('data:image') ||
            val.endsWith('.jpg') || val.endsWith('.jpeg') || val.endsWith('.png')
        );
        if (isImage) {
            return (
                <div
                    onClick={() => setLightboxSrc(val)}
                    className="relative cursor-pointer group overflow-hidden rounded-xl border border-blue-100 bg-blue-50 h-28 flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                    title="Click to enlarge"
                >
                    <img src={val} alt={label} className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-all flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-white text-xs bg-blue-600/80 px-2 py-1 rounded-full backdrop-blur-sm transition-all">🔍 Enlarge</span>
                    </div>
                </div>
            );
        }
        return (
            <a href={val} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-sm font-medium">
                <span>📄</span> <span className="truncate">{typeof val === 'string' ? val.split('/').pop() : 'View File'}</span>
            </a>
        );
    };

    const getVal = (key: string) => {
        if (!details) return null;
        let v = details[key];
        if (key === 'occupy' || key === 'is_same_owner' || key === 'is_with_in_family') {
            if (v === 1 || v === '1') return 'Yes';
            if (v === 0 || v === '0') return 'No';
        }
        if (key === 'land_valuation_amount') return `₹ ${Number(v || 0).toLocaleString('en-IN')}`;
        if ((key === 'license_expiry_date' || key === 'survey_date') && typeof v === 'string') return v.slice(0, 10);
        return v;
    };

    const InfoRow = ({ label, value, accent }: { label: string; value: any; accent?: boolean }) => (
        <div className={`flex flex-col gap-0.5 p-3 rounded-xl ${accent ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100'}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
            <span className={`text-sm font-semibold ${accent ? 'text-blue-700' : 'text-gray-800'} break-words`}>
                {value !== null && value !== undefined && value !== '' ? value : <span className="text-gray-300 font-normal">—</span>}
            </span>
        </div>
    );

    const SectionHeading = ({ children }: { children: React.ReactNode }) => (
        <div className="flex items-center gap-2 mb-3 mt-1">
            <div className="h-4 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500"></div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">{children}</h3>
        </div>
    );

    return (
        <>
            {lightboxSrc && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={() => setLightboxSrc(null)}
                >
                    <button
                        onClick={() => setLightboxSrc(null)}
                        className="absolute top-5 right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
                        aria-label="Close lightbox"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <img
                        src={lightboxSrc}
                        alt="Document Preview"
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col border border-gray-100 overflow-hidden"
                    style={{ maxHeight: '92vh' }}
                >
                    <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-8 pt-8 pb-6 flex-shrink-0">
                        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-indigo-900/20 blur-xl pointer-events-none" />

                        <div className="relative flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                                    <FileText className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">Survey Application</p>
                                    <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
                                        {details?.name || 'Survey Details'}
                                    </h2>
                                    {details?.application_number && (
                                        <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-white/20 border border-white/30 rounded-full text-white text-xs font-mono font-bold backdrop-blur-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                                            {details.application_number}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {details && !isLoading && (
                            <div className="relative mt-5 flex flex-wrap gap-3">
                                {[
                                    { label: 'Haat', value: details.haat_name },
                                    { label: 'District', value: details.police_district_name },
                                    { label: 'Survey Date', value: details.survey_date ? String(details.survey_date).slice(0, 10) : null },
                                    { label: 'Valuation', value: details.land_valuation_amount ? `₹ ${Number(details.land_valuation_amount).toLocaleString('en-IN')}` : null },
                                ].map(s => s.value ? (
                                    <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-xl border border-white/20 backdrop-blur-sm">
                                        <span className="text-blue-200 text-[10px] font-bold uppercase">{s.label}:</span>
                                        <span className="text-white text-xs font-semibold">{s.value}</span>
                                    </div>
                                ) : null)}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 px-6 pt-4 pb-0 border-b border-gray-100 bg-white overflow-x-auto flex-shrink-0 shadow-sm">
                        {tabs.map((tab, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 transition-all whitespace-nowrap ${activeTab === i
                                    ? 'border-blue-600 text-blue-700 bg-blue-50/60'
                                    : 'border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto bg-gray-50/50">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-28 gap-4">
                                <div className="relative w-14 h-14">
                                    <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-indigo-500 animate-spin"></div>
                                </div>
                                <span className="text-gray-500 font-semibold">Loading survey details...</span>
                            </div>
                        ) : !details ? (
                            <div className="flex items-center justify-center py-24">
                                <span className="text-gray-400 text-lg">No data found.</span>
                            </div>
                        ) : (
                            <div className="p-6 space-y-4">
                                {activeTab === 0 && (
                                    <div className="space-y-5">
                                        <SectionHeading>Application Summary</SectionHeading>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            <InfoRow label="Application No" value={getVal('application_number')} accent />
                                            <InfoRow label="Survey Date" value={getVal('survey_date')} />
                                            <InfoRow label="Owner Name" value={getVal('name')} />
                                            <InfoRow label="Guardian Name" value={getVal('guardian_name')} />
                                            <InfoRow label="Mobile" value={getVal('mobile')} />
                                            <InfoRow label="PAN" value={getVal('pan')} />
                                        </div>
                                        <SectionHeading>Valuation</SectionHeading>
                                        <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                                            <div className="p-3 bg-blue-600 rounded-xl shadow-md shadow-blue-300">
                                                <IndianRupee className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Land Valuation Amount</p>
                                                <p className="text-3xl font-black text-blue-700 tracking-tight">
                                                    {details.land_valuation_amount
                                                        ? `₹ ${Number(details.land_valuation_amount).toLocaleString('en-IN')}`
                                                        : <span className="text-gray-300">—</span>}
                                                </p>
                                            </div>
                                        </div>
                                        <SectionHeading>Occupancy</SectionHeading>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <InfoRow label="Is Occupied" value={getVal('occupy')} />
                                            {(details.occupy === 1 || details.occupy === '1') && <>
                                                <InfoRow label="Occupied From Year" value={getVal('occupy_from_year')} />
                                                <InfoRow label="Present Occupier" value={getVal('present_occupier_name')} />
                                                <InfoRow label="Occupier Guardian" value={getVal('occupier_guardian_name')} />
                                            </>}
                                            <InfoRow label="Is Same Owner" value={getVal('is_same_owner')} />
                                            {(details.is_same_owner === 0 || details.is_same_owner === '0') &&
                                                <InfoRow label="Rented To" value={getVal('rented_to_whom')} />}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 1 && (
                                    <div className="space-y-5">
                                        <SectionHeading>Personal Information</SectionHeading>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <InfoRow label="Owner Name" value={getVal('name')} accent />
                                            <InfoRow label="Guardian Name" value={getVal('guardian_name')} />
                                            <InfoRow label="Mobile" value={getVal('mobile')} />
                                            <InfoRow label="Citizenship" value={getVal('citizenship')} />
                                            <InfoRow label="Address" value={getVal('address')} />
                                            <InfoRow label="Pin Code" value={getVal('pin_code')} />
                                            <InfoRow label="PAN" value={getVal('pan')} />
                                            <InfoRow label="Document Number" value={getVal('document_number')} />
                                        </div>
                                        <SectionHeading>Transfer Info</SectionHeading>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <InfoRow label="Within Family" value={getVal('is_with_in_family')} />
                                            <InfoRow label="Transfer Relationship" value={getVal('transfer_relationship')} />
                                            <InfoRow label="Previous License No" value={getVal('previous_license_no')} />
                                            <InfoRow label="License Expiry" value={getVal('license_expiry_date')} />
                                            <InfoRow label="Land Transfer Explanation" value={getVal('land_transfer_explanation')} />
                                            <InfoRow label="Property Tax Year" value={getVal('property_tax_payment_to_year')} />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 2 && (
                                    <div className="space-y-5">
                                        <SectionHeading>Administrative Location</SectionHeading>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            <InfoRow label="Police District" value={getVal('police_district_name')} accent />
                                            <InfoRow label="Police Station" value={getVal('police_station_name')} />
                                            <InfoRow label="Block Name" value={getVal('block_name')} />
                                            <InfoRow label="Mouza Name" value={getVal('mouza_name')} />
                                            <InfoRow label="Municipality" value={getVal('municipality_name')} />
                                            <InfoRow label="Ward No" value={getVal('ward_no')} />
                                            <InfoRow label="Haat Name" value={getVal('haat_name')} />
                                            <InfoRow label="ADSR Name" value={getVal('adsr_name')} />
                                        </div>
                                        <SectionHeading>GPS & Survey</SectionHeading>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <InfoRow label="Latitude" value={getVal('latitude')} />
                                            <InfoRow label="Longitude" value={getVal('longitude')} />
                                            <InfoRow label="Direction" value={getVal('direction')} />
                                        </div>
                                        {details.latitude && details.longitude && (
                                            <a
                                                href={`https://www.google.com/maps?q=${details.latitude},${details.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition-colors w-fit"
                                            >
                                                <MapPin className="w-4 h-4" />
                                                View on Google Maps
                                            </a>
                                        )}
                                    </div>
                                )}

                                {activeTab === 3 && (
                                    <div className="space-y-5">
                                        <SectionHeading>Stall & Property Details</SectionHeading>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            <InfoRow label="Stall No" value={getVal('stall_no')} accent />
                                            <InfoRow label="Holding No" value={getVal('holding_no')} />
                                            <InfoRow label="JL No" value={getVal('jl_no')} />
                                            <InfoRow label="Khatian No" value={getVal('khatian_no')} />
                                            <InfoRow label="Plot No" value={getVal('plot_no')} />
                                            <InfoRow label="Domestic Area (Sqft)" value={getVal('area_dom_sqft')} />
                                            <InfoRow label="Commercial Area (Sqft)" value={getVal('area_com_sqft')} />
                                        </div>
                                        <SectionHeading>Stall Images</SectionHeading>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {['stall_image1', 'stall_image2'].map(f => (
                                                <div key={f}>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{prettyLabels[f]}</p>
                                                    {renderAttachment(details[f], prettyLabels[f])}
                                                </div>
                                            ))}
                                        </div>
                                        <SectionHeading>Sketch Map</SectionHeading>
                                        <div className="max-w-xs">
                                            {renderAttachment(details['sketch_map_attached'], 'Sketch Map')}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 4 && (
                                    <div className="space-y-5">
                                        <SectionHeading>Uploaded Documents & Certificates</SectionHeading>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {[
                                                { key: 'document_image', label: 'Document Image' },
                                                { key: 'pan_image', label: 'PAN Image' },
                                                { key: 'residential_certificate_attached', label: 'Residential Certificate' },
                                                { key: 'trade_license_attached', label: 'Trade License' },
                                                { key: 'affidavit_attached', label: 'Affidavit' },
                                                { key: 'warision_certificate_attached', label: 'Warision Certificate' },
                                                { key: 'death_certificate_attached', label: 'Death Certificate' },
                                                { key: 'noc_legal_heirs_attached', label: 'NOC Legal Heirs' },
                                            ].map(({ key, label }) => (
                                                <div key={key} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{label}</p>
                                                    {renderAttachment(details[key], label)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                            Showing tab <span className="font-bold text-gray-600">{activeTab + 1}</span> of {tabs.length}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab(t => Math.max(t - 1, 0))}
                                disabled={activeTab === 0}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" /> Prev
                            </button>
                            <button
                                onClick={() => setActiveTab(t => Math.min(t + 1, tabs.length - 1))}
                                disabled={activeTab === tabs.length - 1}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-200"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onClose}
                                className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});
// ---- END DesignableModal ----

interface ExtendedSurveyData {
    survey_id?: string;
    application_number: string;
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
    block_municipality_id: number;
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
    block_panchayet_status?: number;
    isUrban?: number;
    ward_id?: number;
    is_urban?: number;
    village_ward_id?: number;
    block_municipality_type?: number;
    block_id?: number;
    municipality_id?: number;
}

type MouzaOption = {
    mouza_id: number;
    mouza_name: string;
    adsr_name: string;
    jl_no: string;
};

type JLNoOption = {
    jl_no: string;
};
type ADSRNameOption = {
    adsr_name: string;
};
type HaatOption = {
    hat_id: number;
    haat_name: string;
};
type ThanaOption = {
    police_station_id: number;
    police_station_name: string;
};

type BlockOption = {
    block_id: number;
    block_name: string;
};

type MunicipalityOption = {
    municipality_id: number;
    municipality_name: string;
};

type PanchayatOption = {
    panchayat_id: number;
    panchayat_name: string;
};

type WardOption = {
    ward_id: number;
    ward_name: string;
};

const PAGE_SIZE = 10;

const ALL_EDIT_FIELDS: { key: keyof ExtendedSurveyData, label: string, type: string }[] = [
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
    { key: "property_tax_payment_to_year", label: "Property Tax Payment To Year", type: "text" },
    { key: "land_transfer_explanation", label: "Land Transfer Explanation", type: "text" },
    { key: "occupy", label: "Is Occupied", type: "text" },
    { key: "occupy_from_year", label: "Occupied From Year", type: "text" },
    { key: "present_occupier_name", label: "Present Occupier Name", type: "text" },
    { key: "occupier_guardian_name", label: "Occupier Guardian Name", type: "text" },
    { key: "adsr_name", label: "ADSR Name", type: "text" },
    { key: "is_same_owner", label: "Is Same Owner", type: "number" },
    { key: "rented_to_whom", label: "Rented To Whom", type: "text" },
    { key: "is_urban", label: "Block/Municipality Type", type: "number" },
    { key: "hat_id", label: "Haat Name", type: "text" },
    { key: "mouza_id", label: "Mouza Name", type: "text" },
    { key: "stall_no", label: "Stall No", type: "text" },
    { key: "holding_no", label: "Holding No", type: "text" },
    { key: "jl_no", label: "JL No", type: "text" },
    { key: "khatian_no", label: "Khatian No", type: "text" },
    { key: "plot_no", label: "Plot No", type: "text" },
    { key: "area_com_sqft", label: "Area (Sqft)", type: "text" },
    { key: "latitude", label: "Latitude", type: "text" },
    { key: "longitude", label: "Longitude", type: "text" },
    { key: "land_valuation_amount", label: "Land Valuation Amount", type: "text" },
    { key: "remarks", label: "Remarks", type: "text" },
];

type RelationshipOption = {
    relationship_id: number;
    relationship_name: string;
};
const DOCUMENT_TYPE_OPTIONS = [
    { value: "1", label: "Aadhar" },
    { value: "2", label: "Votar" }
];
const IS_WITHIN_FAMILY_OPTIONS = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" }
];
const DETAILS_FIELDS_TO_SHOW = [
    "survey_date",
    "application_number",
    "police_district_name",
    "police_station_name",
    "block_name",
    "mouza_name",
    "municipality_name",
    "ward_no",
    "haat_name",
    "name",
    "address",
    "mobile",
    "document_number",
    "land_valuation_amount",
    "guardian_name",
    "citizenship",
    "pin_code",
    "land_transfer_explanation",
    "previous_license_no",
    "license_expiry_date",
    "property_tax_payment_to_year",
    "occupy",
    "occupy_from_year",
    "present_occupier_name",
    "occupier_guardian_name",
    "document_image",
    "pan",
    "pan_image",
    "residential_certificate_attached",
    "trade_license_attached",
    "affidavit_attached",
    "adsr_name",
    "warision_certificate_attached",
    "death_certificate_attached",
    "noc_legal_heirs_attached",
    "is_with_in_family",
    "transfer_relationship",
    "is_same_owner",
    "rented_to_whom",
    "stall_no",
    "holding_no",
    "jl_no",
    "khatian_no",
    "plot_no",
    "area_dom_sqft",
    "area_com_sqft",
    "direction",
    "latitude",
    "longitude",
    "sketch_map_attached",
    "stall_image1",
    "stall_image2"
];

const AsyncImagePreview = React.memo(({ path }: { path: string | null | undefined }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!path) {
            setImgSrc(null);
            setLoading(false);
            return;
        }
        if (path.startsWith('blob:') || path.startsWith('data:')) {
            setImgSrc(path);
            setLoading(false);
            return;
        }
        setLoading(true);
        let active = true;
        commonApiImage(path)
            .then((url: any) => {
                if (active) {
                    setImgSrc(url);
                }
            })
            .catch((err: any) => {
                console.error("AsyncImagePreview error", err);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, [path]);
    if (loading) {
        return <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />;
    }
    if (imgSrc) {
        return (
            <img
                src={imgSrc}
                alt="Preview"
                className="h-16 w-auto object-contain rounded shadow-sm bg-white"
            />
        );
    }
    return <FileText className="w-8 h-8 text-gray-400" />;
});

// ─── EDIT MODAL SECTION COMPONENTS ───────────────────────────────────────────

/** Styled label for edit form fields */
const EditLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
        {children}
    </label>
);

/** Shared input class */
const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-medium " +
    "focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-violet-400 " +
    "placeholder-slate-300 transition-all shadow-sm hover:border-slate-300";

/** Shared select class */
const selectCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-medium " +
    "focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-violet-400 " +
    "transition-all shadow-sm hover:border-slate-300 cursor-pointer";

/** Section divider inside the edit modal */
const EditSection = ({ icon, title, color = "violet" }: { icon: string; title: string; color?: string }) => {
    const colorMap: Record<string, string> = {
        violet: "from-violet-500 to-purple-600",
        rose: "from-rose-500 to-pink-600",
        cyan: "from-cyan-500 to-blue-500",
        amber: "from-amber-400 to-orange-500",
        emerald: "from-emerald-500 to-teal-600",
    };
    return (
        <div className="flex items-center gap-3 col-span-full mt-2 mb-1">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${colorMap[color] || colorMap.violet} flex items-center justify-center text-white text-sm shadow-md`}>
                {icon}
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">{title}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────

const MakerSurveyTable: React.FC = () => {
    const location = useLocation();
    const state = location.state || {};
    const statusId = state._hti || '1';
    const title = state.title || 'Survey Details';

    const [surveyData, setSurveyData] = useState<ExtendedSurveyData[]>([]);
    const [filteredData, setFilteredData] = useState<ExtendedSurveyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);

    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 1);
        return d.toISOString().split('T')[0];
    });

    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [editFields, setEditFields] = useState<Partial<ExtendedSurveyData>>({});
    const [editingSurvey, setEditingSurvey] = useState<ExtendedSurveyData | null>(null);
    const [uploadFiles, setUploadFiles] = useState<MakerUploadFiles>({});
    const [isSaving, setIsSaving] = useState(false);

    const [relationshipOptions, setRelationshipOptions] = useState<RelationshipOption[]>([]);
    const [relationshipLoading, setRelationshipLoading] = useState(false);
    const [relationshipError, setRelationshipError] = useState<string | null>(null);

    const [mouzaOptions, setMouzaOptions] = useState<MouzaOption[]>([]);
    const [mouzaLoading, setMouzaLoading] = useState(false);
    const [mouzaError, setMouzaError] = useState<string | null>(null);

    const [jlNoOptions, setJlNoOptions] = useState<JLNoOption[]>([]);
    const [jlNoLoading, setJlNoLoading] = useState(false);
    const [jlNoError, setJlNoError] = useState<string | null>(null);

    const [adsrNameOptions, setAdsrNameOptions] = useState<ADSRNameOption[]>([]);
    const [adsrLoading, setAdsrLoading] = useState(false);
    const [adsrError, setAdsrError] = useState<string | null>(null);

    const [haatOptions, setHaatOptions] = useState<HaatOption[]>([]);
    const [haatLoading, setHaatLoading] = useState(false);
    const [haatError, setHaatError] = useState<string | null>(null);

    const [thanaOptions, setThanaOptions] = useState<ThanaOption[]>([]);
    const [thanaLoading, setThanaLoading] = useState(false);
    const [thanaError, setThanaError] = useState<string | null>(null);

    const [blockOptions, setBlockOptions] = useState<BlockOption[]>([]);
    const [blockLoading, setBlockLoading] = useState(false);
    const [blockError, setBlockError] = useState<string | null>(null);

    const [municipalityOptions, setMunicipalityOptions] = useState<MunicipalityOption[]>([]);
    const [municipalityLoading, setMunicipalityLoading] = useState(false);
    const [municipalityError, setMunicipalityError] = useState<string | null>(null);

    const [panchayatOptions, setPanchayatOptions] = useState<PanchayatOption[]>([]);
    const [panchayatLoading, setPanchayatLoading] = useState(false);
    const [panchayatError, setPanchayatError] = useState<string | null>(null);

    const [wardOptions, setWardOptions] = useState<WardOption[]>([]);
    const [wardLoading, setWardLoading] = useState(false);
    const [wardError, setWardError] = useState<string | null>(null);

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState<any>(null);

    useEffect(() => {
        setRelationshipLoading(true);
        getRelationshipDetails()
            .then((resp: any) => {
                let rel: any[] = [];
                if (Array.isArray(resp)) rel = resp;
                else if (resp && Array.isArray(resp.data)) rel = resp.data;
                setRelationshipOptions((rel || []).map((r: any) => ({
                    relationship_id: r.relationship_id,
                    relationship_name: r.relationship_name,
                })));
            })
            .catch(() => setRelationshipError('Could not load transfer relationships'))
            .finally(() => setRelationshipLoading(false));
    }, []);

    useEffect(() => {
        if (editingSurvey && editFields.is_urban !== undefined && editFields.is_urban !== null && editFields.is_urban !== 0) {
            const userDetails = decodeJwtToken();
            const boundaryLevelId = userDetails?.BoundaryLevelID || 2;
            const boundaryId = userDetails?.BoundaryID || 9;
            const isUrban = editFields.is_urban;
            const loginUserID = userDetails?.UserID || 0;

            if (editFields.is_urban == 1) {
                setBlockLoading(true);
                setBlockError(null);
                setBlockOptions([]);
                getBoundaryDetailsByBoundaryID(boundaryLevelId, boundaryId, isUrban, loginUserID)
                    .then((resp: any) => {
                        let dataArr: any[] = [];
                        if (Array.isArray(resp)) dataArr = resp;
                        else if (resp && Array.isArray(resp.data)) dataArr = resp.data;
                        setBlockOptions(dataArr.map((item: any) => ({
                            block_id: item.inner_boundary_id,
                            block_name: item.inner_boundary_name
                        })));
                    })
                    .catch(() => setBlockError('Could not load Block list'))
                    .finally(() => setBlockLoading(false));
            } else if (editFields.is_urban === 2) {
                setMunicipalityLoading(true);
                setMunicipalityError(null);
                setMunicipalityOptions([]);
                getBoundaryDetailsByBoundaryID(boundaryLevelId, boundaryId, isUrban, loginUserID)
                    .then((resp: any) => {
                        let dataArr: any[] = [];
                        if (Array.isArray(resp)) dataArr = resp;
                        else if (resp && Array.isArray(resp.data)) dataArr = resp.data;
                        setMunicipalityOptions(dataArr.map((item: any) => ({
                            municipality_id: item.inner_boundary_id,
                            municipality_name: item.inner_boundary_name
                        })));
                    })
                    .catch(() => setMunicipalityError('Could not load Municipality list'))
                    .finally(() => setMunicipalityLoading(false));
            }
        } else {
            setBlockOptions([]);
            setMunicipalityOptions([]);
        }
    }, [editingSurvey, editFields.is_urban]);

    useEffect(() => {
        if (editingSurvey && editFields.is_urban === 1) {
            const userDetails = decodeJwtToken();
            const boundaryLevelId = 5;
            const boundaryId = editFields.block_id;
            const isUrban = 1;
            const loginUserID = userDetails?.UserID || 0;

            setPanchayatLoading(true);
            setPanchayatError(null);
            setPanchayatOptions([]);
            getBoundaryDetailsByBoundaryID(boundaryLevelId, boundaryId || 0, isUrban, loginUserID)
                .then((resp: any) => {
                    let dataArr: any[] = [];
                    if (Array.isArray(resp)) dataArr = resp;
                    else if (resp && Array.isArray(resp.data)) dataArr = resp.data;
                    setPanchayatOptions(dataArr.map((item: any) => ({
                        panchayat_id: item.inner_boundary_id,
                        panchayat_name: item.inner_boundary_name
                    })));
                })
                .catch(() => setPanchayatError('Could not load Panchayat list'))
                .finally(() => setPanchayatLoading(false));
        } else {
            setPanchayatOptions([]);
        }
    }, [editingSurvey, editFields.is_urban, editFields.municipality_id]);

    useEffect(() => {
        if (editingSurvey && editFields.is_urban === 2) {
            const userDetails = decodeJwtToken();
            const boundaryLevelId = 7;
            const boundaryId = editFields.municipality_id;
            const isUrban = 2;
            const loginUserID = userDetails?.UserID || 0;

            setWardLoading(true);
            setWardError(null);
            setWardOptions([]);
            getBoundaryDetailsByBoundaryID(boundaryLevelId, boundaryId || 0, isUrban, loginUserID)
                .then((resp: any) => {
                    let dataArr: any[] = [];
                    if (Array.isArray(resp)) dataArr = resp;
                    else if (resp && Array.isArray(resp.data)) dataArr = resp.data;
                    setWardOptions(dataArr.map((item: any) => ({
                        ward_id: item.inner_boundary_id,
                        ward_name: item.inner_boundary_name,
                    })));
                })
                .catch(() => setWardError('Could not load Ward list'))
                .finally(() => setWardLoading(false));
        } else {
            setWardOptions([]);
        }
    }, [editingSurvey, editFields.is_urban, editFields.municipality_id]);

    useEffect(() => {
        if (
            editingSurvey &&
            (editFields.district_id !== undefined && editFields.district_id !== null && editFields.district_id !== 0)
        ) {
            setThanaLoading(true); setThanaError(null);
            getThanaListByDistrictID(editFields.district_id)
                .then((resp: any) => {
                    let dataArr: any[] = [];
                    if (Array.isArray(resp)) dataArr = resp;
                    else if (resp && Array.isArray(resp.data)) dataArr = resp.data;
                    setThanaOptions(dataArr.map((t: any) => ({
                        police_station_id: t.police_station_id,
                        police_station_name: t.police_station_name
                    })));
                })
                .catch(() => setThanaError("Could not load Police Station list"))
                .finally(() => setThanaLoading(false));
        } else setThanaOptions([]);
    }, [editingSurvey, editFields.district_id]);

    useEffect(() => {
        if (
            editingSurvey &&
            (editFields.police_station_id !== undefined && editFields.police_station_id !== null)
        ) {
            setMouzaLoading(true); setMouzaError(null);
            getMouzaListByPoliceStationID(editFields.police_station_id)
                .then((resp: any) => {
                    let dataArr: any[] = [];
                    if (Array.isArray(resp)) dataArr = resp;
                    else if (resp && Array.isArray(resp.data)) dataArr = resp.data;
                    setMouzaOptions(dataArr.map((m: any) => ({
                        mouza_id: m.mouza_id,
                        mouza_name: m.mouza_name,
                        adsr_name: m.adsr_name,
                        jl_no: m.jl_no
                    })));
                })
                .catch(() => setMouzaError("Could not load mouza list"))
                .finally(() => setMouzaLoading(false));
        } else setMouzaOptions([]);
    }, [editingSurvey, editFields.police_station_id]);

    useEffect(() => {
        if (
            editingSurvey &&
            (editFields.police_station_id !== undefined && editFields.police_station_id !== null)
        ) {
            setJlNoLoading(true); setJlNoError(null);
            getJLNoByPoliceStationID(editFields.police_station_id)
                .then((resp: any) => {
                    let dataArr: any[] = [];
                    if (Array.isArray(resp)) dataArr = resp;
                    else if (resp && Array.isArray(resp.data)) dataArr = resp.data;
                    setJlNoOptions(dataArr.map((j: any) => ({
                        jl_no: j.jl_no
                    })));
                })
                .catch(() => setJlNoError("Could not load JL No list"))
                .finally(() => setJlNoLoading(false));
        } else setJlNoOptions([]);
    }, [editingSurvey, editFields.police_station_id]);

    useEffect(() => {
        if (
            editingSurvey &&
            (editFields.police_station_id !== undefined && editFields.police_station_id !== null)
        ) {
            setAdsrLoading(true); setAdsrError(null);
            getADSRNameByPoliceStationID(editFields.police_station_id)
                .then((resp: any) => {
                    let dataArr: any[] = [];
                    if (Array.isArray(resp)) dataArr = resp;
                    else if (resp && Array.isArray(resp.data)) dataArr = resp.data;
                    setAdsrNameOptions(dataArr.map((a: any) => ({
                        adsr_name: a.adsr_name
                    })));
                })
                .catch(() => setAdsrError("Could not load ADSR Name list"))
                .finally(() => setAdsrLoading(false));
        } else setAdsrNameOptions([]);
    }, [editingSurvey, editFields.police_station_id]);

    useEffect(() => {
        if (
            editingSurvey &&
            (editFields.district_id !== undefined && editFields.district_id !== null)
        ) {
            setHaatLoading(true); setHaatError(null);
            getAllHaatDetailsByDistrictID(editFields.district_id)
                .then((resp: any) => {
                    let dataArr: any[] = [];
                    if (Array.isArray(resp)) dataArr = resp;
                    else if (resp && Array.isArray(resp.data)) dataArr = resp.data;
                    setHaatOptions(dataArr.map((h: any) => ({
                        hat_id: h.hat_id || h.haat_id,
                        haat_name: h.haat_name
                    })));
                })
                .catch(() => setHaatError("Could not load Haat list"))
                .finally(() => setHaatLoading(false));
        } else setHaatOptions([]);
    }, [editingSurvey, editFields.district_id]);

    const handleViewClick = React.useCallback(async (survey: ExtendedSurveyData) => {
        if (!survey.survey_id) {
            alert('Survey ID not found');
            return;
        }
        try {
            setShowDetailsModal(true);
            setIsLoadingDetails(true);
            setSelectedDetails(null);

            const userDetails = decodeJwtToken();
            const boundaryLevelId = userDetails?.BoundaryLevelID || 2;
            const boundaryId = userDetails?.BoundaryID || 9;
            const data = await getSurveyDetailsForMakerByBoundaryID(
                boundaryLevelId,
                boundaryId,
                0,
                '',
                ''
            );

            let foundSurvey = null;
            if (Array.isArray(data)) {
                foundSurvey = data.find((item: any) => String(item.survey_id) === String(survey.survey_id));
            }
            foundSurvey = foundSurvey || survey;

            const imageFields = [
                'document_image', 'pan_image', 'residential_certificate_attached',
                'trade_license_attached', 'affidavit_attached', 'warision_certificate_attached',
                'death_certificate_attached', 'noc_legal_heirs_attached', 'sketch_map_attached',
                'stall_image1', 'stall_image2'
            ];

            const imagePromises: Record<string, Promise<any>> = {};
            for (const field of imageFields) {
                if (foundSurvey[field]) {
                    imagePromises[field] = commonApiImage(foundSurvey[field]);
                }
            }

            const images = await Promise.all(
                Object.entries(imagePromises).map(async ([key, promise]) => {
                    try {
                        const img = await promise;
                        return [key, img];
                    } catch (error) {
                        console.error(`Failed to load ${key}:`, error);
                        return [key, null];
                    }
                })
            );

            const imageMap = Object.fromEntries(images);

            const details: Record<string, any> = {};
            for (const f of DETAILS_FIELDS_TO_SHOW) {
                if (Object.prototype.hasOwnProperty.call(foundSurvey, f)) {
                    details[f] = imageMap[f] || (foundSurvey as any)[f];
                } else if (
                    f === "document_number" && ("document_no" in foundSurvey)
                ) {
                    details[f] = (foundSurvey as any).document_no;
                } else if (
                    f === "is_with_in_family" && ("is_within_family" in foundSurvey)
                ) {
                    details[f] = (foundSurvey as any).is_within_family;
                }
            }
            setSelectedDetails(details);
        } catch (error) {
            setSelectedDetails(null);
            console.error('Error loading survey details:', error);
            alert('Failed to fetch application details. Please try again.');
        } finally {
            setIsLoadingDetails(false);
        }
    }, []);

    const handleEditClick = React.useCallback((survey: ExtendedSurveyData) => {
        setEditingSurvey(survey);

        setEditFields(() => {
            const normalizeId = (val: number | undefined | null) =>
                val !== undefined && val !== null && val !== 0 ? val : undefined;

            const editObj: Partial<ExtendedSurveyData> = {
                ...Object.fromEntries(
                    ALL_EDIT_FIELDS.map(f => {
                        let val = survey[f.key];
                        if (val === undefined || val === null || val === '') {
                            if (f.key === 'name' && survey.shop_owner_name) val = survey.shop_owner_name;
                            else if (f.key === 'mobile' && survey.mobile_number) val = survey.mobile_number;
                            else if (f.key === 'document_no' && survey.document_number) val = survey.document_number;
                            else if (f.key === 'is_within_family' && (survey as any).is_with_in_family !== undefined && (survey as any).is_with_in_family !== null) {
                                val = (survey as any).is_with_in_family;
                            } else if (f.key === 'hat_id' && (survey as any).hat_id !== undefined && (survey as any).hat_id !== null) {
                                val = (survey as any).hat_id;
                            }
                        }
                        if (f.key === "document_type" && (val === 1 || val === 2)) val = val.toString();
                        return [
                            f.key,
                            val !== undefined && val !== null
                                ? val
                                : (f.type === 'text' ? '' : f.type === 'date' ? null : undefined)
                        ];
                    })
                )
            };
            editObj.police_station_id = normalizeId(survey.police_station_id);
            editObj.block_panchayet_status = normalizeId(survey.block_panchayet_status);
            editObj.district_id = normalizeId(survey.district_id);
            editObj.is_urban = normalizeId(survey.is_urban);
            editObj.block_id = normalizeId(survey.block_id);
            editObj.municipality_id = normalizeId(survey.municipality_id);
            if (editObj.is_urban === 1) {
                editObj.block_id = editObj.block_id;
            } else if (editObj.is_urban === 2) {
                editObj.municipality_id = editObj.municipality_id;
            }
            editObj.village_ward_id = normalizeId(survey.block_panchayet_status);
            editObj.mouza_name = survey.mouza_name ?? '';
            editObj.municipality_name = survey.municipality_name ?? '';
            editObj.ward_no = survey.ward_no ?? '';
            editObj.ward_id = normalizeId(survey.ward_id);
            editObj.block_name = survey.block_name ?? '';
            editObj.police_station_id = normalizeId(survey.police_station_id);
            editObj.district_id = normalizeId(survey.district_id);
            editObj.is_urban = normalizeId(survey.is_urban);
            editObj.block_municipality_type = normalizeId(survey.block_municipality_type);
            editObj.hat_id = survey.hat_id;
            editObj.haat_name = survey.haat_name ?? '';
            editObj.mouza_id = survey.mouza_id;
            editObj.mouza_name = survey.mouza_name ?? '';
            editObj.jl_no = survey.jl_no ?? '';
            editObj.adsr_name = survey.adsr_name ?? '';
            return editObj;
        });
        setUploadFiles({});
    }, []);

    const handleFieldChange = React.useCallback((key: keyof ExtendedSurveyData, value: any) => {
        setEditFields(prev => {
            if (key === 'police_station_id' && prev.police_station_id !== value) {
                return { ...prev, [key]: value, hat_id: undefined, mouza_id: undefined, jl_no: '', adsr_name: '' };
            }
            if (key === 'block_id' && prev.block_id !== value) {
                return {
                    ...prev,
                    block_id: value as number,
                    village_ward_id: undefined
                };
            }
            if (key === 'municipality_id' && prev.municipality_id !== value) {
                return {
                    ...prev,
                    municipality_id: value as number,
                    ward_id: undefined
                };
            }
            if (key === 'is_urban' && prev.is_urban !== value) {
                const newType =
                    value === "" || value === undefined || value === null
                        ? undefined
                        : Number(value);
                return {
                    ...prev,
                    [key]: newType,
                    block_municipality_type: newType,
                    block_municipality_id: undefined,
                    village_ward_id: undefined,
                    ward_id: undefined
                };
            }
            if (key === 'block_municipality_id' && prev.block_municipality_id !== value) {
                return {
                    ...prev,
                    [key]: value,
                    village_ward_id: undefined,
                    ward_id: undefined
                };
            }
            if (key === 'district_id' && prev.district_id !== value) {
                return { ...prev, [key]: value, police_station_id: undefined, hat_id: undefined, mouza_id: undefined, jl_no: '', adsr_name: '' };
            }
            if (key === 'document_type') {
                return { ...prev, [key]: value };
            }
            return { ...prev, [key]: value };
        });
    }, []);

    const handleFileChange = React.useCallback((key: keyof MakerUploadFiles, file: File | null) => {
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                Swal.fire({
                    icon: 'warning',
                    title: 'File too large',
                    text: 'Image size should be less than 2MB',
                    confirmButtonColor: '#f59e0b',
                });
                return;
            }
            setUploadFiles(prev => ({ ...prev, [key]: file }));
        } else {
            setUploadFiles(prev => {
                const newFiles = { ...prev };
                delete newFiles[key];
                return newFiles;
            });
        }
    }, []);

    const handleSave = React.useCallback(async () => {
        if (!editingSurvey || !editingSurvey.survey_id) return;
        try {
            setIsSaving(true);
            const userDetails = decodeJwtToken();
            const payload = {
                ...editingSurvey,
                ...editFields,
                survey_id: editingSurvey.survey_id,
                user_id: userDetails?.UserID
            };
            const response = await updateSurveyDetailsByMaker(uploadFiles, payload);

            if (response && (response.status === 0 || response.message?.toLowerCase().includes('success'))) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Survey details updated successfully!',
                    confirmButtonColor: '#0ea5e9',
                    confirmButtonText: 'OK'
                });

                setEditingSurvey(null);
                setEditFields({});
                setUploadFiles({});
                setReloadTrigger(prev => prev + 1);
            } else {
                throw new Error(response?.message || 'Update failed');
            }
        } catch (error) {
            console.error('Error updating survey:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update survey details. Please try again.',
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsSaving(false);
        }
    }, [editingSurvey, editFields, uploadFiles]);

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

    useEffect(() => {
        const maxPage = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
        if (currentPage > maxPage) {
            setCurrentPage(maxPage);
        }
    }, [filteredData, currentPage]);

    const fetchSurveyData = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const userDetails = decodeJwtToken();
            const boundaryLevelId = userDetails?.BoundaryLevelID || 2;
            const boundaryId = userDetails?.BoundaryID || 9;

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
    }, [startDate, endDate, statusId]);

    const [reloadTrigger, setReloadTrigger] = useState(0);
    useEffect(() => {
        if (reloadTrigger > 0) fetchSurveyData();
    }, [reloadTrigger, fetchSurveyData]);

    const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value), []);
    const handleStartDateChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value), []);
    const handleEndDateChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value), []);

    const handleCloseDetailsModal = React.useCallback(() => {
        setShowDetailsModal(false);
        setSelectedDetails(null);
    }, []);

    const handleCloseEditModal = React.useCallback(() => setEditingSurvey(null), []);

    const handleEditSubmit = React.useCallback((e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    }, [handleSave]);

    console.log("blockOptions", editFields.block_id);
    console.log("mouzaOptions", editFields.mouza_id);

    const totalItems = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    const paginatedData = React.useMemo(() => filteredData.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    ), [filteredData, currentPage]);

    const handlePrevPage = React.useCallback(() => setCurrentPage((p) => Math.max(p - 1, 1)), []);
    const handleNextPage = React.useCallback(() => setCurrentPage((p) => Math.min(p + 1, totalPages)), [totalPages]);
    const handleGotoPage = React.useCallback((n: number) => setCurrentPage(n), []);

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
                                onChange={handleSearchChange}
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
                                    onChange={handleStartDateChange}
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
                                    onChange={handleEndDateChange}
                                    className="px-4 py-3.5 bg-sky-50/50 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent text-gray-800 transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card-Based Table */}
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
                                                            ? 'Votar'
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
                                    <div className="flex justify-end pt-4 border-t border-sky-100 mt-4 gap-3">
                                        <button
                                            onClick={() => handleViewClick(row)}
                                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-emerald-500/30 font-medium"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>
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

                            {/* View Details Modal (unchanged) */}
                            <DesignableModal
                                show={showDetailsModal}
                                onClose={handleCloseDetailsModal}
                                isLoading={isLoadingDetails}
                                details={selectedDetails}
                            />

                            {/* ══════════════════════════════════════════════════════
                                REDESIGNED EDIT SURVEY MODAL
                            ══════════════════════════════════════════════════════ */}
                            {editingSurvey && (
                                <div className="fixed z-[40] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm" style={{ top: 0, bottom: 0, left: '260px', right: 0, padding: '80px 16px 16px 16px' }}>
                                    {/* Modal shell */}
                                    <div
                                        className="relative bg-white w-full max-w-5xl flex flex-col overflow-hidden"
                                        style={{
                                            maxHeight: 'calc(100vh - 96px)',
                                            borderRadius: '24px',
                                            boxShadow: '0 32px 80px -12px rgba(109,40,217,0.28), 0 0 0 1px rgba(139,92,246,0.15)',
                                        }}
                                    >
                                        {/* ── Decorative top stripe ── */}
                                        <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 flex-shrink-0" />

                                        {/* ── Header ── */}
                                        <div className="flex-shrink-0 flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-violet-50/40">
                                            <div className="flex items-center gap-4">
                                                {/* Icon badge */}
                                                <div className="relative">
                                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-300/50">
                                                        <Edit className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                                                        Edit Survey Details
                                                    </h2>
                                                    <p className="text-[11px] text-slate-400 font-semibold mt-1 tracking-wider uppercase">
                                                        App No:&nbsp;
                                                        <span className="font-mono font-bold text-violet-600">
                                                            {editingSurvey.application_number}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleCloseEditModal}
                                                className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 hover:bg-rose-50 hover:text-rose-500 text-slate-400 transition-all border border-slate-200 hover:border-rose-200"
                                                aria-label="Close"
                                            >
                                                <X className="w-4.5 h-4.5" />
                                            </button>
                                        </div>

                                        {/* ── Scrollable body ── */}
                                        <form onSubmit={handleEditSubmit} className="flex-1 flex flex-col overflow-hidden min-h-0">
                                        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-2 bg-slate-50/60">

                                                {/* ─── FIELDS GRID ─────────────────────────── */}
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">

                                                    {/* ── Section: Location ── */}
                                                    <EditSection icon="📍" title="Location" color="cyan" />

                                                    {/* Police Station */}
                                                    <div>
                                                        <EditLabel>Police Station</EditLabel>
                                                        {thanaLoading ? (
                                                            <div className="flex items-center gap-2 text-violet-600 text-xs py-2.5">
                                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading…
                                                            </div>
                                                        ) : thanaError ? (
                                                            <p className="text-rose-500 text-xs py-2">{thanaError}</p>
                                                        ) : (
                                                            <>
                                                                <select
                                                                    className={selectCls}
                                                                    value={
                                                                        editFields.police_station_id === undefined || editFields.police_station_id === null || editFields.police_station_id === 0
                                                                            ? ""
                                                                            : String(editFields.police_station_id)
                                                                    }
                                                                    onChange={e =>
                                                                        handleFieldChange(
                                                                            'police_station_id',
                                                                            e.target.value === "" ? undefined : Number(e.target.value)
                                                                        )
                                                                    }
                                                                    disabled={!(editFields.district_id !== undefined && editFields.district_id !== null && editFields.district_id !== 0)}
                                                                >
                                                                    <option value="">— Select Police Station —</option>
                                                                    {thanaOptions.map((thana, index) =>
                                                                        <option key={`thana-${thana.police_station_id}-${index}`} value={thana.police_station_id}>
                                                                            {thana.police_station_name}
                                                                        </option>
                                                                    )}
                                                                </select>
                                                                {(editFields.district_id === undefined || editFields.district_id === null || editFields.district_id === 0) && (
                                                                    <p className="text-[10px] text-amber-500 mt-1 font-medium">⚠ Select District ID first</p>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Block / Municipality Type */}
                                                    <div>
                                                        <EditLabel>Block / Municipality Type</EditLabel>
                                                        <select
                                                            className={selectCls}
                                                            value={
                                                                editFields.is_urban === undefined || editFields.is_urban === null || editFields.is_urban === 0
                                                                    ? ""
                                                                    : String(editFields.is_urban)
                                                            }
                                                            onChange={e =>
                                                                handleFieldChange(
                                                                    'is_urban',
                                                                    e.target.value === "" ? undefined : Number(e.target.value)
                                                                )
                                                            }
                                                        >
                                                            <option value="">— Select Type —</option>
                                                            <option value="1">Block</option>
                                                            <option value="2">Municipality</option>
                                                        </select>
                                                    </div>

                                                    {/* Conditional Block */}
                                                    {editFields.is_urban === 1 && (
                                                        <div>
                                                            <EditLabel>Block</EditLabel>
                                                            {blockLoading ? (
                                                                <div className="flex items-center gap-2 text-violet-600 text-xs py-2.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading…</div>
                                                            ) : blockError ? (
                                                                <p className="text-rose-500 text-xs py-2">{blockError}</p>
                                                            ) : (
                                                                <select
                                                                    className={selectCls}
                                                                    value={
                                                                        editFields.block_id === undefined || editFields.block_id === null || editFields.block_id === 0
                                                                            ? ""
                                                                            : String(editFields.block_id)
                                                                    }
                                                                    onChange={e => {
                                                                        handleFieldChange(
                                                                            'block_id',
                                                                            e.target.value === "" ? undefined : Number(e.target.value)
                                                                        );
                                                                    }}
                                                                >
                                                                    <option value="">— Select Block —</option>
                                                                    {blockOptions.map((block, index) =>
                                                                        <option key={`${block.block_id}-${index}`} value={block.block_id}>
                                                                            {block.block_name}
                                                                        </option>
                                                                    )}
                                                                </select>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Conditional Municipality */}
                                                    {editFields.is_urban === 2 && (
                                                        <div>
                                                            <EditLabel>Municipality</EditLabel>
                                                            {municipalityLoading ? (
                                                                <div className="flex items-center gap-2 text-violet-600 text-xs py-2.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading…</div>
                                                            ) : municipalityError ? (
                                                                <p className="text-rose-500 text-xs py-2">{municipalityError}</p>
                                                            ) : (
                                                                <select
                                                                    className={selectCls}
                                                                    value={
                                                                        editFields.municipality_id === undefined || editFields.municipality_id === null || editFields.municipality_id === 0
                                                                            ? ""
                                                                            : String(editFields.municipality_id)
                                                                    }
                                                                    onChange={e => {
                                                                        handleFieldChange(
                                                                            'municipality_id',
                                                                            e.target.value === "" ? undefined : Number(e.target.value)
                                                                        );
                                                                    }}
                                                                >
                                                                    <option value="">— Select Municipality —</option>
                                                                    {municipalityOptions.map((municipality, index) =>
                                                                        <option key={`${municipality.municipality_id}-${index}`} value={municipality.municipality_id}>
                                                                            {municipality.municipality_name}
                                                                        </option>
                                                                    )}
                                                                </select>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Conditional Panchayat */}
                                                    {editFields.is_urban === 1 && (
                                                        <div>
                                                            <EditLabel>Panchayat</EditLabel>
                                                            {panchayatLoading ? (
                                                                <div className="flex items-center gap-2 text-violet-600 text-xs py-2.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading…</div>
                                                            ) : panchayatError ? (
                                                                <p className="text-rose-500 text-xs py-2">{panchayatError}</p>
                                                            ) : (
                                                                <select
                                                                    className={selectCls}
                                                                    value={
                                                                        editFields.village_ward_id === undefined || editFields.village_ward_id === null || editFields.village_ward_id === 0
                                                                            ? ""
                                                                            : String(editFields.village_ward_id)
                                                                    }
                                                                    onChange={e =>
                                                                        handleFieldChange(
                                                                            'village_ward_id',
                                                                            e.target.value === "" ? undefined : Number(e.target.value)
                                                                        )
                                                                    }
                                                                >
                                                                    <option value="">— Select Panchayat —</option>
                                                                    {panchayatOptions.map((panchayat, index) =>
                                                                        <option key={`${panchayat.panchayat_id}-${index}`} value={panchayat.panchayat_id}>
                                                                            {panchayat.panchayat_name}
                                                                        </option>
                                                                    )}
                                                                </select>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Conditional Ward */}
                                                    {editFields.is_urban == 2 && (
                                                        <div>
                                                            <EditLabel>Ward</EditLabel>
                                                            {wardLoading ? (
                                                                <div className="flex items-center gap-2 text-violet-600 text-xs py-2.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading…</div>
                                                            ) : wardError ? (
                                                                <p className="text-rose-500 text-xs py-2">{wardError}</p>
                                                            ) : (
                                                                <select
                                                                    className={selectCls}
                                                                    value={
                                                                        editFields.ward_id === undefined || editFields.ward_id === null || editFields.ward_id === 0
                                                                            ? ""
                                                                            : String(editFields.ward_id)
                                                                    }
                                                                    onChange={e =>
                                                                        handleFieldChange(
                                                                            'ward_id',
                                                                            e.target.value === "" ? undefined : Number(e.target.value)
                                                                        )
                                                                    }
                                                                >
                                                                    <option value="">— Select Ward —</option>
                                                                    {wardOptions.map((ward, index) =>
                                                                        <option key={`${ward.ward_id}-${index}`} value={ward.ward_id}>
                                                                            {ward.ward_name}
                                                                        </option>
                                                                    )}
                                                                </select>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* ── Dynamic fields ── */}
                                                    {ALL_EDIT_FIELDS
                                                        .filter(field => field.key !== 'police_station_name')
                                                        .filter(field => field.key !== 'police_station_id')
                                                        .filter(field => field.key !== 'is_urban')
                                                        .filter(field => field.key !== 'block_municipality_id')
                                                        .filter(field => {
                                                            if (editFields.occupy === 0 || String(editFields.occupy) === '0') {
                                                                if (['occupy_from_year', 'present_occupier_name', 'occupier_guardian_name'].includes(field.key as string)) {
                                                                    return false;
                                                                }
                                                            }
                                                            if (editFields.is_same_owner === 1 || String(editFields.is_same_owner) === '1') {
                                                                if (['rented_to_whom'].includes(field.key as string)) {
                                                                    return false;
                                                                }
                                                            }
                                                            return true;
                                                        })
                                                        .map((field, fieldIdx) => {
                                                            // ── Insert section dividers at key boundaries ──
                                                            const sectionBreaks: Record<string, { icon: string; title: string; color: string }> = {
                                                                name: { icon: '👤', title: 'Personal Details', color: 'violet' },
                                                                occupy: { icon: '🏠', title: 'Occupancy', color: 'amber' },
                                                                adsr_name: { icon: '🗺', title: 'Survey & Property', color: 'emerald' },
                                                                stall_no: { icon: '🏪', title: 'Stall Information', color: 'rose' },
                                                                latitude: { icon: '📡', title: 'GPS Coordinates', color: 'cyan' },
                                                                land_valuation_amount: { icon: '💰', title: 'Valuation & Notes', color: 'amber' },
                                                            };

                                                            const sectionBreak = sectionBreaks[field.key as string];

                                                            return (
                                                                <React.Fragment key={String(field.key)}>
                                                                    {sectionBreak && (
                                                                        <EditSection
                                                                            icon={sectionBreak.icon}
                                                                            title={sectionBreak.title}
                                                                            color={sectionBreak.color}
                                                                        />
                                                                    )}
                                                                    <div>
                                                                        <EditLabel>{field.label}</EditLabel>

                                                                        {/* ── Select / Input logic (identical to original) ── */}
                                                                        {field.key === 'occupy' ? (
                                                                            <select
                                                                                className={selectCls}
                                                                                value={
                                                                                    editFields.occupy === undefined || editFields.occupy === null
                                                                                        ? ""
                                                                                        : String(editFields.occupy)
                                                                                }
                                                                                onChange={e =>
                                                                                    handleFieldChange(
                                                                                        field.key,
                                                                                        e.target.value === "" ? undefined : Number(e.target.value)
                                                                                    )
                                                                                }
                                                                            >
                                                                                <option value="">— Select —</option>
                                                                                <option value="1">Yes</option>
                                                                                <option value="0">No</option>
                                                                            </select>
                                                                        ) : field.key === 'is_same_owner' ? (
                                                                            <select
                                                                                className={selectCls}
                                                                                value={
                                                                                    editFields.is_same_owner === undefined || editFields.is_same_owner === null
                                                                                        ? ""
                                                                                        : String(editFields.is_same_owner)
                                                                                }
                                                                                onChange={e =>
                                                                                    handleFieldChange(
                                                                                        field.key,
                                                                                        e.target.value === "" ? undefined : Number(e.target.value)
                                                                                    )
                                                                                }
                                                                            >
                                                                                <option value="">— Select —</option>
                                                                                <option value="1">Yes</option>
                                                                                <option value="0">No</option>
                                                                            </select>
                                                                        ) : field.key === 'is_within_family' ? (
                                                                            <select
                                                                                className={selectCls}
                                                                                value={
                                                                                    editFields.is_within_family === undefined || editFields.is_within_family === null
                                                                                        ? ""
                                                                                        : String(editFields.is_within_family)
                                                                                }
                                                                                onChange={e =>
                                                                                    handleFieldChange(
                                                                                        field.key,
                                                                                        e.target.value === "" ? undefined : Number(e.target.value)
                                                                                    )
                                                                                }
                                                                            >
                                                                                <option value="">— Select —</option>
                                                                                {IS_WITHIN_FAMILY_OPTIONS.map(opt => (
                                                                                    <option key={String(opt.value)} value={opt.value}>
                                                                                        {opt.label}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        ) : field.key === 'transfer_relationship' ? (
                                                                            <>
                                                                                {relationshipLoading ? (
                                                                                    <div className="flex items-center gap-2 text-violet-600 text-xs py-2.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading…</div>
                                                                                ) : relationshipError ? (
                                                                                    <p className="text-rose-500 text-xs py-2">{relationshipError}</p>
                                                                                ) : (
                                                                                    <select
                                                                                        className={selectCls}
                                                                                        value={
                                                                                            editFields.transfer_relationship === 0 || editFields.transfer_relationship === undefined || editFields.transfer_relationship === null
                                                                                                ? ""
                                                                                                : editFields.transfer_relationship
                                                                                        }
                                                                                        onChange={e =>
                                                                                            handleFieldChange(
                                                                                                field.key,
                                                                                                e.target.value === '' ? 0 : Number(e.target.value)
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <option value="">— Select Relationship —</option>
                                                                                        {relationshipOptions.map((opt, index) => (
                                                                                            <option key={`${opt.relationship_id}-${index}`} value={opt.relationship_id}>{opt.relationship_name}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                )}
                                                                            </>
                                                                        ) : field.key === 'hat_id' ? (
                                                                            <>
                                                                                {haatLoading ? (
                                                                                    <div className="flex items-center gap-2 text-violet-600 text-xs py-2.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading…</div>
                                                                                ) : haatError ? (
                                                                                    <p className="text-rose-500 text-xs py-2">{haatError}</p>
                                                                                ) : (
                                                                                    <select
                                                                                        className={selectCls}
                                                                                        value={
                                                                                            editFields.hat_id === undefined || editFields.hat_id === null || editFields.hat_id === 0
                                                                                                ? ""
                                                                                                : String(editFields.hat_id)
                                                                                        }
                                                                                        onChange={e =>
                                                                                            handleFieldChange(
                                                                                                field.key,
                                                                                                e.target.value === "" ? undefined : Number(e.target.value)
                                                                                            )
                                                                                        }
                                                                                        disabled={!(editFields.district_id !== undefined && editFields.district_id !== null)}
                                                                                    >
                                                                                        <option value="">— Select Haat —</option>
                                                                                        {haatOptions.map((haat, index) =>
                                                                                            <option key={`${haat.hat_id}-${index}`} value={haat.hat_id}>
                                                                                                {haat.haat_name}
                                                                                            </option>
                                                                                        )}
                                                                                    </select>
                                                                                )}
                                                                                {(editFields.district_id === undefined || editFields.district_id === null) && (
                                                                                    <p className="text-[10px] text-amber-500 mt-1 font-medium">⚠ District required</p>
                                                                                )}
                                                                            </>
                                                                        ) : field.key === 'mouza_id' ? (
                                                                            <>
                                                                                {mouzaLoading ? (
                                                                                    <div className="flex items-center gap-2 text-violet-600 text-xs py-2.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading…</div>
                                                                                ) : mouzaError ? (
                                                                                    <p className="text-rose-500 text-xs py-2">{mouzaError}</p>
                                                                                ) : (
                                                                                    <select
                                                                                        className={selectCls}
                                                                                        value={
                                                                                            editFields.mouza_id === undefined || editFields.mouza_id === null || editFields.mouza_id === 0
                                                                                                ? ""
                                                                                                : String(editFields.mouza_id)
                                                                                        }
                                                                                        onChange={e =>
                                                                                            handleFieldChange(
                                                                                                field.key,
                                                                                                e.target.value === "" ? undefined : Number(e.target.value)
                                                                                            )
                                                                                        }
                                                                                        disabled={!(editFields.police_station_id !== undefined && editFields.police_station_id !== null)}
                                                                                    >
                                                                                        <option value="">— Select Mouza —</option>
                                                                                        {mouzaOptions.map((mouza, index) =>
                                                                                            <option key={`${mouza.mouza_id}-${index}`} value={mouza.mouza_id}>
                                                                                                {mouza.mouza_name} {mouza.jl_no ? `(${mouza.jl_no})` : ""}
                                                                                            </option>
                                                                                        )}
                                                                                    </select>
                                                                                )}
                                                                                {(editFields.police_station_id === undefined || editFields.police_station_id === null) && (
                                                                                    <p className="text-[10px] text-amber-500 mt-1 font-medium">⚠ Police Station required</p>
                                                                                )}
                                                                            </>
                                                                        ) : field.key === 'jl_no' ? (
                                                                            <>
                                                                                {jlNoLoading ? (
                                                                                    <div className="flex items-center gap-2 text-violet-600 text-xs py-2.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading…</div>
                                                                                ) : jlNoError ? (
                                                                                    <p className="text-rose-500 text-xs py-2">{jlNoError}</p>
                                                                                ) : (
                                                                                    <select
                                                                                        className={selectCls}
                                                                                        value={editFields.jl_no || ""}
                                                                                        onChange={e =>
                                                                                            handleFieldChange(
                                                                                                field.key,
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                        disabled={!(editFields.police_station_id !== undefined && editFields.police_station_id !== null)}
                                                                                    >
                                                                                        <option value="">— Select JL No —</option>
                                                                                        {jlNoOptions.map((jl, idx) => (
                                                                                            <option key={`${jl.jl_no}-${idx}`} value={jl.jl_no}>{jl.jl_no}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                )}
                                                                                {(editFields.police_station_id === undefined || editFields.police_station_id === null) && (
                                                                                    <p className="text-[10px] text-amber-500 mt-1 font-medium">⚠ Police Station required</p>
                                                                                )}
                                                                            </>
                                                                        ) : field.key === 'adsr_name' ? (
                                                                            <>
                                                                                {adsrLoading ? (
                                                                                    <div className="flex items-center gap-2 text-violet-600 text-xs py-2.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading…</div>
                                                                                ) : adsrError ? (
                                                                                    <p className="text-rose-500 text-xs py-2">{adsrError}</p>
                                                                                ) : (
                                                                                    <select
                                                                                        className={selectCls}
                                                                                        value={editFields.adsr_name || ""}
                                                                                        onChange={e =>
                                                                                            handleFieldChange(
                                                                                                field.key,
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                        disabled={!(editFields.police_station_id !== undefined && editFields.police_station_id !== null)}
                                                                                    >
                                                                                        <option value="">— Select ADSR Name —</option>
                                                                                        {adsrNameOptions.map((adsr, idx) => (
                                                                                            <option key={`${adsr.adsr_name}-${idx}`} value={adsr.adsr_name}>
                                                                                                {adsr.adsr_name}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                )}
                                                                                {(editFields.police_station_id === undefined || editFields.police_station_id === null) && (
                                                                                    <p className="text-[10px] text-amber-500 mt-1 font-medium">⚠ Police Station required</p>
                                                                                )}
                                                                            </>
                                                                        ) : field.key === "district_id" ? (
                                                                            <input
                                                                                className={inputCls}
                                                                                type="number"
                                                                                value={
                                                                                    (editFields.district_id !== undefined && editFields.district_id !== null)
                                                                                        ? editFields.district_id
                                                                                        : ""
                                                                                }
                                                                                min="1"
                                                                                step="1"
                                                                                onChange={e =>
                                                                                    handleFieldChange(
                                                                                        field.key,
                                                                                        e.target.value === ""
                                                                                            ? undefined
                                                                                            : Number(e.target.value)
                                                                                    )
                                                                                }
                                                                            />
                                                                        ) : field.key === "document_type" ? (
                                                                            <select
                                                                                className={selectCls}
                                                                                value={
                                                                                    editFields.document_type !== undefined &&
                                                                                        editFields.document_type !== null
                                                                                        ? String(editFields.document_type)
                                                                                        : ""
                                                                                }
                                                                                onChange={e =>
                                                                                    handleFieldChange(
                                                                                        field.key,
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                            >
                                                                                <option value="">— Select Document Type —</option>
                                                                                {DOCUMENT_TYPE_OPTIONS.map(opt => (
                                                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                                                ))}
                                                                            </select>
                                                                        ) : field.type === "date" ? (
                                                                            <input
                                                                                className={inputCls}
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
                                                                                className={inputCls}
                                                                                type={field.type}
                                                                                value={
                                                                                    (editFields[field.key] !== undefined && editFields[field.key] !== null)
                                                                                        ? (editFields[field.key] as string | number)
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
                                                                </React.Fragment>
                                                            );
                                                        })}
                                                </div>

                                                {/* ─── DOCUMENT UPLOADS ────────────────────── */}
                                                <div className="mt-8">
                                                    <div className="flex items-center gap-3 mb-5">
                                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-sm shadow-md">
                                                            📎
                                                        </div>
                                                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Documents & Attachments</span>
                                                        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
                                                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                                                            Max 2 MB per file
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                        {[
                                                            { key: 'documentImage', label: 'Document Image', emoji: '🪪' },
                                                            { key: 'panImage', label: 'PAN Card', emoji: '💳' },
                                                            { key: 'residentialCertificateAttached', label: 'Residential Cert.', emoji: '🏡' },
                                                            { key: 'tradeLicenseAttached', label: 'Trade License', emoji: '📜' },
                                                            { key: 'affidavitAttached', label: 'Affidavit', emoji: '⚖️' },
                                                            { key: 'warisionCertificateAttached', label: 'Warision Cert.', emoji: '📋' },
                                                            { key: 'deathCertificateAttached', label: 'Death Certificate', emoji: '📄' },
                                                            { key: 'nocLegalHeirsAttached', label: 'NOC Legal Heirs', emoji: '📃' },
                                                            { key: 'landValuationDoc', label: 'Land Valuation Doc', emoji: '🏷️' },
                                                            { key: 'sketchMapAttached', label: 'Sketch Map', emoji: '🗺️' },
                                                            { key: 'stallImage1', label: 'Stall Image 1', emoji: '🖼️' },
                                                            { key: 'stallImage2', label: 'Stall Image 2', emoji: '🖼️' },
                                                        ].map((field) => {
                                                            const camelToSnakeMap: Record<string, string> = {
                                                                documentImage: 'document_image',
                                                                panImage: 'pan_image',
                                                                residentialCertificateAttached: 'residential_certificate_attached',
                                                                tradeLicenseAttached: 'trade_license_attached',
                                                                affidavitAttached: 'affidavit_attached',
                                                                warisionCertificateAttached: 'warision_certificate_attached',
                                                                deathCertificateAttached: 'death_certificate_attached',
                                                                nocLegalHeirsAttached: 'noc_legal_heirs_attached',
                                                                landValuationDoc: 'land_valuation_doc',
                                                                sketchMapAttached: 'sketch_map_attached',
                                                                stallImage1: 'stall_image1',
                                                                stallImage2: 'stall_image2',
                                                            };
                                                            const existingFile = editingSurvey ? (editingSurvey as any)[camelToSnakeMap[field.key]] : null;
                                                            const hasNew = !!uploadFiles[field.key as keyof MakerUploadFiles];
                                                            const hasExisting = !!existingFile;

                                                            return (
                                                                <div key={field.key}>
                                                                    <input
                                                                        type="file"
                                                                        id={`upload-${field.key}`}
                                                                        className="hidden"
                                                                        onChange={(e) => handleFileChange(field.key as keyof MakerUploadFiles, e.target.files ? e.target.files[0] : null)}
                                                                        accept="image/*,.pdf"
                                                                    />
                                                                    <label
                                                                        htmlFor={`upload-${field.key}`}
                                                                        className={`
                                                                            flex flex-col items-center justify-center gap-2 w-full h-32 rounded-2xl border-2 cursor-pointer
                                                                            transition-all duration-200 group relative overflow-hidden
                                                                            ${hasNew
                                                                                ? 'border-emerald-400 bg-emerald-50 shadow-md shadow-emerald-100'
                                                                                : hasExisting
                                                                                    ? 'border-violet-300 bg-violet-50 shadow-sm shadow-violet-100'
                                                                                    : 'border-dashed border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/50 hover:shadow-md'
                                                                            }
                                                                        `}
                                                                    >
                                                                        {/* Status glow */}
                                                                        {hasNew && (
                                                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent pointer-events-none" />
                                                                        )}
                                                                        {hasExisting && !hasNew && (
                                                                            <div className="absolute inset-0 bg-gradient-to-br from-violet-400/10 to-transparent pointer-events-none" />
                                                                        )}

                                                                        {hasNew ? (
                                                                            <>
                                                                                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                                                                                    <CheckCircle className="w-5 h-5 text-white" />
                                                                                </div>
                                                                                <p className="text-[10px] font-bold text-emerald-700 text-center px-2 leading-tight line-clamp-2">
                                                                                    {(uploadFiles[field.key as keyof MakerUploadFiles] as File).name}
                                                                                </p>
                                                                                <span className="text-[9px] text-emerald-500 font-semibold">Click to change</span>
                                                                            </>
                                                                        ) : hasExisting ? (
                                                                            <>
                                                                                <div className="relative mb-0.5">
                                                                                    <AsyncImagePreview path={existingFile as string} />
                                                                                </div>
                                                                                <p className="text-[10px] font-bold text-violet-700 text-center px-2 leading-tight truncate w-full max-w-[110px]">
                                                                                    {typeof existingFile === 'string' ? existingFile.split('/').pop() : 'File Exists'}
                                                                                </p>
                                                                                <span className="text-[9px] text-violet-400 font-semibold">Click to replace</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <span className="text-2xl leading-none group-hover:scale-110 transition-transform">
                                                                                    {field.emoji}
                                                                                </span>
                                                                                <p className="text-[10px] font-bold text-slate-500 text-center px-2 leading-tight group-hover:text-violet-600 transition-colors">
                                                                                    {field.label}
                                                                                </p>
                                                                                <div className="flex items-center gap-1 text-slate-300 group-hover:text-violet-400 transition-colors">
                                                                                    <Upload className="w-3 h-3" />
                                                                                    <span className="text-[9px] font-semibold">Upload</span>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </label>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                        </div>{/* end scrollable body */}

                                        {/* ── Fixed Footer (outside scroll, always visible) ── */}
                                        <div className="flex-shrink-0 px-8 py-4 bg-white border-t border-slate-100 flex items-center justify-between gap-4">
                                            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                                                All changes will be saved immediately after confirmation.
                                            </p>
                                            <div className="flex items-center gap-3 ml-auto">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingSurvey(null)}
                                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSaving}
                                                    className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold text-white
                                                        bg-gradient-to-r from-violet-600 to-purple-600
                                                        hover:from-violet-700 hover:to-purple-700
                                                        shadow-lg shadow-violet-300/40
                                                        disabled:opacity-60 disabled:cursor-not-allowed
                                                        transition-all active:scale-[0.98]"
                                                >
                                                    {isSaving ? (
                                                        <>
                                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                                            Saving…
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        </form>{/* end form wrapping scrollable + footer */}
                                    </div>{/* end modal shell */}
                                </div>
                            )}
                            {/* ══ END REDESIGNED EDIT MODAL ══ */}
                        </>
                    )}
                </div>

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