import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
} from '../surveyAPI/surveyAPI';
import { commonApiImage } from '../../Service/commonAPI';
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

// ---- Modal (for View Details) ----
const DesignableModal = ({
    show,
    onClose,
    isLoading,
    details
}: {
    show: boolean;
    onClose: () => void;
    isLoading: boolean;
    details: any;
}) => {
    if (!show) return null;

    // Function to render file/image/attachment value
    const renderAttachment = (val: any) => {
        if (!val) return <span className="text-gray-400">No file</span>;

        // Check if it's a blob URL (from commonApiImage) or base64 data URL
        if (typeof val === 'string' && (val.startsWith('blob:') || val.startsWith('data:image'))) {
            return (
                <div
                    onClick={() => {
                        // Open blob URL in new window/tab
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
                    }}
                    className="inline-block cursor-pointer"
                    title="Click to open in new tab"
                >
                    <img
                        src={val}
                        alt="Attachment"
                        className="h-16 max-w-full border rounded shadow hover:opacity-80 transition-opacity"
                        style={{ background: '#f7fafc', objectFit: 'contain' }}
                    />
                </div>
            );
        }

        // Check if it's a file path that needs to be converted
        if (typeof val === 'string' && (val.endsWith('.jpg') || val.endsWith('.jpeg') || val.endsWith('.png') || val.endsWith('.pdf'))) {
            // For images, show as clickable image
            if (val.endsWith('.jpg') || val.endsWith('.jpeg') || val.endsWith('.png')) {
                return (
                    <a
                        href={val}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Click to open in new tab"
                    >
                        <img
                            src={val}
                            alt="Attachment"
                            className="h-16 max-w-full border rounded shadow cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ background: '#f7fafc', objectFit: 'contain' }}
                        />
                    </a>
                );
            }
            // For PDFs or other files, show as link
            return (
                <a
                    className="text-blue-600 underline text-sm"
                    href={val}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {val}
                </a>
            );
        }
        return <span className="text-gray-500 text-sm">{val}</span>;
    };

    // Only show the fields as per required keys in DETAILS_FIELDS_TO_SHOW:
    const fieldOrder = [
        "survey_date", "application_number", "police_district_name", "police_station_name", "block_name", "mouza_name", "municipality_name", "ward_no",
        "haat_name", "name", "address", "mobile", "document_number", "land_valuation_amount", "guardian_name", "citizenship", "pin_code",
        "land_transfer_explanation", "previous_license_no", "license_expiry_date", "property_tax_payment_to_year", "occupy", "occupy_from_year",
        "present_occupier_name", "occupier_guardian_name", "document_image", "pan", "pan_image", "residential_certificate_attached", "trade_license_attached",
        "affidavit_attached", "adsr_name", "warision_certificate_attached", "death_certificate_attached", "noc_legal_heirs_attached", "is_with_in_family",
        "transfer_relationship", "is_same_owner", "rented_to_whom", "stall_no", "holding_no", "jl_no", "khatian_no", "plot_no", "area_dom_sqft", "area_com_sqft", "direction",
        "latitude", "longitude", "sketch_map_attached", "stall_image1", "stall_image2"
    ];

    const prettyLabels: Record<string, string> = {
        survey_date: "Survey Date",
        application_number: "Application Number",
        police_district_name: "Police District Name",
        police_station_name: "Police Station Name",
        block_name: "Block Name",
        mouza_name: "Mouza Name",
        municipality_name: "Municipality Name",
        ward_no: "Ward No",
        haat_name: "Haat Name",
        name: "Name",
        address: "Address",
        mobile: "Mobile",
        document_number: "Document Number",
        land_valuation_amount: "Land Valuation Amount",
        guardian_name: "Guardian Name",
        citizenship: "Citizenship",
        pin_code: "Pin Code",
        land_transfer_explanation: "Land Transfer Explanation",
        previous_license_no: "Previous License No",
        license_expiry_date: "License Expiry Date",
        property_tax_payment_to_year: "Property Tax Payment To Year",
        occupy: "Occupy",
        occupy_from_year: "Occupy From Year",
        present_occupier_name: "Present Occupier Name",
        occupier_guardian_name: "Occupier Guardian Name",
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
        is_with_in_family: "Is Within Family",
        transfer_relationship: "Transfer Relationship",
        is_same_owner: "Is Same Owner",
        rented_to_whom: "Rented To Whom",
        stall_no: "Stall No",
        holding_no: "Holding No",
        jl_no: "JL No",
        khatian_no: "Khatian No",
        plot_no: "Plot No",
        area_dom_sqft: "Area DOM Sqft",
        area_com_sqft: "Area Commercial Sqft",
        direction: "Direction",
        latitude: "Latitude",
        longitude: "Longitude",
        sketch_map_attached: "Sketch Map",
        stall_image1: "Stall Image 1",
        stall_image2: "Stall Image 2"
    };

    // Organize grouped/priority fields for good UI; others in grid
    const primaryFields = [
        "application_number", "name", "guardian_name", "land_valuation_amount", "pan", "mobile",
        "police_district_name", "police_station_name", "block_name", "mouza_name", "municipality_name", "ward_no", "haat_name"
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur flex-col">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[92vh] flex flex-col border border-sky-100">
                <div className="flex justify-between items-center px-7 py-5 border-b border-sky-100 bg-gradient-to-r from-blue-50 to-sky-50/90">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <FileText className="text-blue-700 w-6 h-6" />
                            <h2 className="text-2xl font-bold tracking-tight text-gray-700">
                                Survey Details
                            </h2>
                        </div>
                        {details?.application_number && (
                            <div className="font-mono text-xs text-gray-500">
                                Application No: <span className="font-bold text-blue-700">{details.application_number}</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full hover:bg-gray-200 transition-colors p-2 duration-100"
                        aria-label="Close"
                    >
                        <X className="text-gray-600 w-6 h-6" />
                    </button>
                </div>
                <div className="px-8 py-6 flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center w-full py-24">
                            <RefreshCw className="w-7 h-7 animate-spin text-blue-400 mr-3" />
                            <span className="text-blue-700 font-semibold text-lg">Loading details...</span>
                        </div>
                    ) : details ? (
                        <>
                            {/* Show primary info as highlight block */}
                            <div className="mb-6 bg-sky-50 border border-sky-100 rounded-xl px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                                {primaryFields.map(f => {
                                    if (!(f in details)) return null;
                                    let val = details[f];
                                    if (f === "land_valuation_amount")
                                        val = Number(val || 0).toLocaleString();
                                    return (
                                        <div key={f}>
                                            <div className="text-xs text-gray-500 font-bold uppercase">{prettyLabels[f] || f}</div>
                                            <div className="font-semibold text-gray-800">
                                                {val ? val : <span className="text-gray-400">-</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Show the rest as data grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
                                {fieldOrder
                                    .filter(f => !primaryFields.includes(f)) // avoid duplicate
                                    .map(f => {
                                        if (!(f in details)) return null;
                                        let val = details[f];
                                        if (f.endsWith("attached") || f.endsWith("image") || ["sketch_map_attached", "stall_image1", "stall_image2"].includes(f)) {
                                            return (
                                                <div key={f} className="mb-2">
                                                    <div className="text-xs text-gray-500 font-bold">{prettyLabels[f] || f}</div>
                                                    <div>{renderAttachment(val)}</div>
                                                </div>
                                            );
                                        }
                                        if (f === "license_expiry_date" || f === "survey_date") {
                                            val = val && typeof val === 'string' ? val.slice(0, 10) : val;
                                        }
                                        return (
                                            <div key={f} className="mb-2">
                                                <div className="text-xs text-gray-500 font-bold">{prettyLabels[f] || f}</div>
                                                <div className="text-gray-700 font-medium">
                                                    {val && val !== "" && val !== null ? val : <span className="text-gray-400">-</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center py-16">
                            <span className="text-gray-400 text-lg">No data found.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
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
// ... all the option and field type defs ... (unmodified)
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
    { key: "occupy", label: "Occupy", type: "text" },
    { key: "occupy_from_year", label: "Occupy From Year", type: "text" },
    { key: "present_occupier_name", label: "Present Occupier Name", type: "text" },
    { key: "occupier_guardian_name", label: "Occupier Guardian Name", type: "text" },
    { key: "adsr_name", label: "ADSR Name", type: "text" },
    { key: "is_same_owner", label: "Is Same Owner", type: "number" },
    { key: "rented_to_whom", label: "Rented To Whom", type: "text" },
    // { key: "district_id", label: "District ID", type: "number" },
    { key: "is_urban", label: "Block/Municipality Type", type: "number" },
    // { key: "block_municipality_id", label: "Block/Municipality ID", type: "text" },
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

    const [editingSurvey, setEditingSurvey] = useState<ExtendedSurveyData | null>(null);
    const [editFields, setEditFields] = useState<Partial<ExtendedSurveyData>>({});
    const [uploadFiles, setUploadFiles] = useState<MakerUploadFiles>({});
    const [isSaving, setIsSaving] = useState(false);

    // Dropdowns states (unmodified)
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

    // --- New Designable Modal State for Details ---
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

    // Fetch Block or Municipality options when block_municipality_type changes
    useEffect(() => {
        if (editingSurvey && editFields.is_urban !== undefined && editFields.is_urban !== null && editFields.is_urban !== 0) {
            const userDetails = decodeJwtToken();
            const boundaryLevelId = userDetails?.BoundaryLevelID || 2;
            const boundaryId = userDetails?.BoundaryID || 9;
            const isUrban = editFields.is_urban; // 1 for Block, 2 for Municipality
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
                // Fetch Municipality options (inner_boundary_level_id: 7)
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

    // Fetch Panchayat options when Block is selected
    useEffect(() => {
        if (editingSurvey && editFields.is_urban === 1) {
            const userDetails = decodeJwtToken();
            const boundaryLevelId = 5; // Block level
            const boundaryId = editFields.block_id; // Selected Block ID
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

    // Fetch Ward options when Municipality is selected
    useEffect(() => {
        if (editingSurvey && editFields.is_urban === 2) {
            const userDetails = decodeJwtToken();
            const boundaryLevelId = 7; // Municipality level
            const boundaryId = editFields.municipality_id; // Selected Municipality ID
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

    // dropdowns for edit (unmodified)
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

    // ---- REWRITE: handleViewClick to fetch details from API and show in new DesignableModal
    const handleViewClick = async (survey: ExtendedSurveyData) => {
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
            // Fallback to partial local row if API did not return
            foundSurvey = foundSurvey || survey;

            // Fetch images using commonApiImage
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

            // Try to fill in is_with_in_family (or is_within_family), document_number (or document_no), etc.
            const details: Record<string, any> = {};
            for (const f of DETAILS_FIELDS_TO_SHOW) {
                if (Object.prototype.hasOwnProperty.call(foundSurvey, f)) {
                    // Use image from imageMap if available
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
    };

    // --- rest of your code (edits, saving, search, pagination, etc) unmodified ---
    const handleEditClick = (survey: ExtendedSurveyData) => {
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
                            // Handle backend naming differences so values pre-fill correctly
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
            // Pre-fill additional fields that are handled separately
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
            // Pre-fill village_ward_id for Panchayat dropdown
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
    };

    const handleFieldChange = (key: keyof ExtendedSurveyData, value: any) => {
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
    };

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
            const payload = {
                ...editingSurvey,
                ...editFields,
                survey_id: editingSurvey.survey_id,
                user_id: userDetails?.UserID
            };
            const response = await updateSurveyDetailsByMaker(uploadFiles, payload);

            // Check if response indicates success
            if (response && (response.status === 0 || response.message?.toLowerCase().includes('success'))) {
                // Show SweetAlert success message
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
                fetchSurveyData();
            } else {
                throw new Error(response?.message || 'Update failed');
            }
        } catch (error) {
            console.error('Error updating survey:', error);
            // Show SweetAlert error message
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

    console.log("blockOptions", editFields.block_id);
    console.log("mouzaOptions", editFields.mouza_id);

    const totalItems = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const paginatedData = filteredData.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );
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
                            {/* REPLACEMENT: New Designable Modal */}
                            <DesignableModal
                                show={showDetailsModal}
                                onClose={() => {
                                    setShowDetailsModal(false);
                                    setSelectedDetails(null);
                                }}
                                isLoading={isLoadingDetails}
                                details={selectedDetails}
                            />
                            {/* --- End Details Modal --- */}
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

                                                    <div className="mb-1">
                                                        <label className="block text-sm font-bold text-gray-600 mb-2">
                                                            Police Station
                                                        </label>
                                                        {thanaLoading ? (
                                                            <div className="text-blue-700 text-xs py-2">Loading Police Station list...</div>
                                                        ) : thanaError ? (
                                                            <div className="text-red-600 text-xs py-2">{thanaError}</div>
                                                        ) : (
                                                            <select
                                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
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
                                                                <option value="">-- Select Police Station --</option>
                                                                {thanaOptions.map((thana, index) =>
                                                                    <option key={`thana-${thana.police_station_id}-${index}`} value={thana.police_station_id}>
                                                                        {thana.police_station_name}
                                                                    </option>
                                                                )}
                                                            </select>
                                                        )}
                                                        {(editFields.district_id === undefined || editFields.district_id === null || editFields.district_id === 0) && (
                                                            <div className="text-[11px] text-gray-400 mt-1">
                                                                Please select District ID first (required for Police Station)
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Block/Municipality Type Dropdown */}
                                                    <div className="mb-1">
                                                        <label className="block text-sm font-bold text-gray-600 mb-2">
                                                            Block/Municipality Type
                                                        </label>
                                                        <select
                                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
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
                                                            <option value="">-- Select Type --</option>
                                                            <option value="1">Block</option>
                                                            <option value="2">Municipality</option>
                                                        </select>
                                                    </div>

                                                    {/* Conditional Block Dropdown (shows when Block is selected) */}
                                                    {editFields.is_urban === 1 && (
                                                        <div className="mb-1">
                                                            <label className="block text-sm font-bold text-gray-600 mb-2">
                                                                Block
                                                            </label>
                                                            {blockLoading ? (
                                                                <div className="text-blue-700 text-xs py-2">Loading Block list...</div>
                                                            ) : blockError ? (
                                                                <div className="text-red-600 text-xs py-2">{blockError}</div>
                                                            ) : (
                                                                <select
                                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
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


                                                                    <option value="">-- Select Block --</option>
                                                                    {blockOptions.map((block, index) =>
                                                                        <option key={`${block.block_id}-${index}`} value={block.block_id}>
                                                                            {block.block_name}
                                                                        </option>
                                                                    )}
                                                                </select>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Conditional Municipality Dropdown (shows when Municipality is selected) */}
                                                    {editFields.is_urban === 2 && (
                                                        <div className="mb-1">
                                                            <label className="block text-sm font-bold text-gray-600 mb-2">
                                                                Municipality
                                                            </label>
                                                            {municipalityLoading ? (
                                                                <div className="text-blue-700 text-xs py-2">Loading Municipality list...</div>
                                                            ) : municipalityError ? (
                                                                <div className="text-red-600 text-xs py-2">{municipalityError}</div>
                                                            ) : (
                                                                <select
                                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
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
                                                                    <option value="">-- Select Municipality --</option>
                                                                    {municipalityOptions.map((municipality, index) =>
                                                                        <option key={`${municipality.municipality_id}-${index}`} value={municipality.municipality_id}>
                                                                            {municipality.municipality_name}
                                                                        </option>
                                                                    )}
                                                                </select>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Conditional Panchayat Dropdown (shows after Block selection) */}
                                                    {editFields.is_urban === 1 && (
                                                        <div className="mb-1">
                                                            <label className="block text-sm font-bold text-gray-600 mb-2">
                                                                Panchayat
                                                            </label>
                                                            {panchayatLoading ? (
                                                                <div className="text-blue-700 text-xs py-2">Loading Panchayat list...</div>
                                                            ) : panchayatError ? (
                                                                <div className="text-red-600 text-xs py-2">{panchayatError}</div>
                                                            ) : (
                                                                <select
                                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
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
                                                                    <option value="">-- Select Panchayat --</option>
                                                                    {panchayatOptions.map((panchayat, index) =>
                                                                        <option key={`${panchayat.panchayat_id}-${index}`} value={panchayat.panchayat_id}>
                                                                            {panchayat.panchayat_name}
                                                                        </option>
                                                                    )}
                                                                </select>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Conditional Ward Dropdown (shows after Municipality selection) */}
                                                    {editFields.is_urban == 2 && (
                                                        <div className="mb-1">
                                                            <label className="block text-sm font-bold text-gray-600 mb-2">
                                                                Ward
                                                            </label>
                                                            {wardLoading ? (
                                                                <div className="text-blue-700 text-xs py-2">Loading Ward list...</div>
                                                            ) : wardError ? (
                                                                <div className="text-red-600 text-xs py-2">{wardError}</div>
                                                            ) : (
                                                                <select
                                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
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
                                                                    <option value="">-- Select Ward --</option>
                                                                    {wardOptions.map((ward, index) =>
                                                                        <option key={`${ward.ward_id}-${index}`} value={ward.ward_id}>
                                                                            {ward.ward_name}
                                                                        </option>
                                                                    )}
                                                                </select>
                                                            )}
                                                        </div>
                                                    )}

                                                    {ALL_EDIT_FIELDS
                                                        .filter(field => field.key !== 'police_station_name')
                                                        .filter(field => field.key !== 'police_station_id')
                                                        .filter(field => field.key !== 'is_urban')
                                                        .filter(field => field.key !== 'block_municipality_id')
                                                        .map(field => (
                                                            <div key={String(field.key)} className="mb-1">
                                                                <label className="block text-sm font-bold text-gray-600 mb-2">
                                                                    {field.label}
                                                                </label>
                                                                {field.key === 'is_within_family' ? (
                                                                    <select
                                                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
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
                                                                        <option value="">-- Select --</option>
                                                                        {IS_WITHIN_FAMILY_OPTIONS.map(opt => (
                                                                            <option key={String(opt.value)} value={opt.value}>
                                                                                {opt.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                ) : field.key === 'transfer_relationship' ? (
                                                                    <>
                                                                        {relationshipLoading ? (
                                                                            <div className="text-blue-700 text-xs py-2">Loading transfer relationships...</div>
                                                                        ) : relationshipError ? (
                                                                            <div className="text-red-600 text-xs py-2">{relationshipError}</div>
                                                                        ) : (
                                                                            <select
                                                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
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
                                                                                <option value="">-- Select Relationship --</option>
                                                                                {relationshipOptions.map((opt, index) => (
                                                                                    <option key={`${opt.relationship_id}-${index}`} value={opt.relationship_id}>{opt.relationship_name}</option>
                                                                                ))}
                                                                            </select>
                                                                        )}
                                                                    </>
                                                                ) : field.key === 'hat_id' ? (
                                                                    <>
                                                                        {haatLoading ? (
                                                                            <div className="text-blue-700 text-xs py-2">Loading Haat List...</div>
                                                                        ) : haatError ? (
                                                                            <div className="text-red-600 text-xs py-2">{haatError}</div>
                                                                        ) : (
                                                                            <select
                                                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
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
                                                                                <option value="">-- Select Haat --</option>
                                                                                {haatOptions.map((haat, index) =>
                                                                                    <option key={`${haat.hat_id}-${index}`} value={haat.hat_id}>
                                                                                        {haat.haat_name}
                                                                                    </option>
                                                                                )}
                                                                            </select>
                                                                        )}
                                                                        {(editFields.district_id === undefined ||
                                                                            editFields.district_id === null) && (
                                                                                <div className="text-[11px] text-gray-400 mt-1">
                                                                                    District selection required for dropdown
                                                                                </div>
                                                                            )}
                                                                    </>
                                                                ) : field.key === 'mouza_id' ? (
                                                                    <>
                                                                        {mouzaLoading ? (
                                                                            <div className="text-blue-700 text-xs py-2">Loading Mouza List...</div>
                                                                        ) : mouzaError ? (
                                                                            <div className="text-red-600 text-xs py-2">{mouzaError}</div>
                                                                        ) : (
                                                                            <select
                                                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
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
                                                                                <option value="">-- Select Mouza --</option>
                                                                                {mouzaOptions.map((mouza, index) =>
                                                                                    <option key={`${mouza.mouza_id}-${index}`} value={mouza.mouza_id}>
                                                                                        {mouza.mouza_name} {mouza.jl_no ? `(${mouza.jl_no})` : ""}
                                                                                    </option>
                                                                                )}
                                                                            </select>
                                                                        )}
                                                                        {(editFields.police_station_id === undefined ||
                                                                            editFields.police_station_id === null) && (
                                                                                <div className="text-[11px] text-gray-400 mt-1">
                                                                                    Police Station selection required for dropdown
                                                                                </div>
                                                                            )}
                                                                    </>
                                                                ) : field.key === 'jl_no' ? (
                                                                    <>
                                                                        {jlNoLoading ? (
                                                                            <div className="text-blue-700 text-xs py-2">Loading JL No list...</div>
                                                                        ) : jlNoError ? (
                                                                            <div className="text-red-600 text-xs py-2">{jlNoError}</div>
                                                                        ) : (
                                                                            <select
                                                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
                                                                                value={editFields.jl_no || ""}
                                                                                onChange={e =>
                                                                                    handleFieldChange(
                                                                                        field.key,
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                                disabled={!(editFields.police_station_id !== undefined && editFields.police_station_id !== null)}
                                                                            >
                                                                                <option value="">-- Select JL No --</option>
                                                                                {jlNoOptions.map((jl, idx) => (
                                                                                    <option key={`${jl.jl_no}-${idx}`} value={jl.jl_no}>{jl.jl_no}</option>
                                                                                ))}
                                                                            </select>
                                                                        )}
                                                                        {(editFields.police_station_id === undefined ||
                                                                            editFields.police_station_id === null) && (
                                                                                <div className="text-[11px] text-gray-400 mt-1">
                                                                                    Police Station selection required for dropdown
                                                                                </div>
                                                                            )}
                                                                    </>
                                                                ) : field.key === 'adsr_name' ? (
                                                                    <>
                                                                        {adsrLoading ? (
                                                                            <div className="text-blue-700 text-xs py-2">Loading ADSR Name list...</div>
                                                                        ) : adsrError ? (
                                                                            <div className="text-red-600 text-xs py-2">{adsrError}</div>
                                                                        ) : (
                                                                            <select
                                                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
                                                                                value={editFields.adsr_name || ""}
                                                                                onChange={e =>
                                                                                    handleFieldChange(
                                                                                        field.key,
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                                disabled={!(editFields.police_station_id !== undefined && editFields.police_station_id !== null)}
                                                                            >
                                                                                <option value="">-- Select ADSR Name --</option>
                                                                                {adsrNameOptions.map((adsr, idx) => (
                                                                                    <option key={`${adsr.adsr_name}-${idx}`} value={adsr.adsr_name}>
                                                                                        {adsr.adsr_name}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        )}
                                                                        {(editFields.police_station_id === undefined ||
                                                                            editFields.police_station_id === null) && (
                                                                                <div className="text-[11px] text-gray-400 mt-1">
                                                                                    Police Station selection required for dropdown
                                                                                </div>
                                                                            )}
                                                                    </>
                                                                ) : field.key === "district_id" ? (
                                                                    <input
                                                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
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
                                                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-sky-400 focus:border-sky-400"
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
                                                                        <option value="">-- Select Document Type --</option>
                                                                        {DOCUMENT_TYPE_OPTIONS.map(opt => (
                                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                                        ))}
                                                                    </select>
                                                                ) : field.type === "date" ? (
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
                                                        ))}
                                                </div>
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
