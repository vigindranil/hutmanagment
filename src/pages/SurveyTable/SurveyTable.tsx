"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { decodeJwtToken } from "../../utils/decodeToken";
import { createRoot } from "react-dom/client";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  X,
  CheckCircle,
  Calendar,
  Building,
  User,
  Phone,
  IndianRupee,
  Send,
  Check,
  MessageSquare,
  Eye,
  User2Icon,
  MessageSquareX,
  Download,
} from "lucide-react";
import Swal from "sweetalert2";
import bgimg from "../../assets/table background.jpg";
import { CertificateTemplate } from "../../components/Certificate";
import html2pdf from "html2pdf.js";

// Import API Functions
import {
  getHaatApplicantionDetailsForAdmin,
  getCheckerDashboardDetails,
  savePaymentDetailsBySurveyID,
  getSurveyDetailsByShopOwnerID,
  getHearingDetailsByHearingUserID,
  getSurveyDetailsByApprovalOfficerID,
  getHaatManagerDashboardDtlsByHaatManagerID,
  fetchFullApplicationDetails,
  saveHearingDateByCheckerID,
  submitRemarksAction,
  getCertificateDetails,
} from "../surveyAPI/surveyAPI";

// Import Modal Components
import {
  PaymentModal,
  HearingModal,
  RemarksModal,
  ViewDetailsModal,
  PdfPreviewModal,
} from "../SurveyModals/SurveyModals";

interface SurveyData {
  survey_id: number;
  survey_date: string;
  hearing_date: string;
  application_number: string;
  haat_id: number;
  haat_name: string;
  shop_owner_name: string;
  mobile_number: string;
  survey_status: string;
  amount: number;
  initial_amount: number;
  final_amount: number;
  land_valuation: number;
  application_status?: number;
  relation_status?: number;
}

interface FullApplicationDetails {
  survey_id: number;
  name: string;
  guardian_name: string;
  address: string;
  mobile: string;
  citizenship: string;
  pin_code: number;
  license_type: number;
  application_status: number;
  usage_type: number;
  applicant_type: number;
  license_expiry_date: string;
  property_tax_payment_to_year: number;
  occupy: boolean;
  occupy_from_year: number;
  area_dom_sqft: number;
  area_com_sqft: number;
  latitude: number;
  longitude: number;
  is_within_family?: boolean;
  transfer_relationship?: string;
  document_type?: string;
  document_image?: string;
  pan?: string;
  pan_image?: string;
  previous_license_no?: string;
  land_transfer_explanation?: string;
  present_occupier_name?: string;
  occupier_guardian_name?: string;
  residential_certificate_attached?: string;
  trade_license_attached?: string;
  affidavit_attached?: string;
  adsr_name?: string;
  warision_certificate_attached?: string;
  death_certificate_attached?: string;
  noc_legal_heirs_attached?: string;
  is_same_owner?: boolean;
  rented_to_whom?: string;
  district_id?: number;
  police_station_id?: number;
  hat_id?: number;
  mouza_id?: number;
  stall_no?: string;
  holding_no?: string;
  jl_no?: string;
  khatian_no?: string;
  plot_no?: string;
  direction?: string;
  sketch_map_attached?: string;
  stall_image1?: string;
  stall_image2?: string;
  user_id?: number;
  hearing_date?: string;
  hearing_time?: string;
  hearing_venue?: string;
  hearing_remarks?: string;
  hearing_approved_by?: string;
  approval_remarks?: string;
  approval_date?: string;
  survey_approved_by?: string;
  initial_payment_amount?: string;
  final_payment_amount?: string;
  land_valuation_amount?: string;
  initial_amount?: string;
  final_amount?: string;
  initial_payment_status?: number;
  final_payment_status?: number;
  hearing_approved_date?: string;
}

const ITEMS_PER_PAGE = 10;

const SurveyTable: React.FC = () => {
  const [searchParams] = useSearchParams();
  const haatStatusId = searchParams?.get("_hti");
  const title = searchParams?.get("title");
  const dashboardType = searchParams?.get("dashboardType");
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyData | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHearingModal, setShowHearingModal] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPdfPreviewModal, setShowPdfPreviewModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string>("");
  const [selectedDetails, setSelectedDetails] = useState<FullApplicationDetails | null>(null);
  const [paymentName, setPaymentName] = useState("");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(1);
  const [loads, setLoads] = useState(false);
  const [hearingDate, setHearingDate] = useState("");
  const [selectedSurveys, setSelectedSurveys] = useState<number[]>([]);
  const [hearingRemarks, setHearingRemarks] = useState<string>("");
  const [remarksText, setRemarksText] = useState<string>("");
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve");
  const [selectedSurveyForRemarks, setSelectedSurveyForRemarks] = useState<number | null>(null);
  const [isLoadingDetails, setisLoadingDetails] = useState(false);
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Handle View Click
  const handleViewClick = async (surveyId: string) => {
    try {
      setIsModalOpen(true);
      setisLoadingDetails(true);
      const details = await fetchFullApplicationDetails(surveyId);
      setSelectedDetails(details);
    } catch (error) {
      console.error("Error fetching full details:", error);
      alert("Failed to fetch application details. Make sure your credentials/token are valid.");
    } finally {
      setisLoadingDetails(false);
    }
  };

  // Handle Download Certificate
  const handleDownloadClick = async (survey: any) => {
    if (!survey || !survey.application_number) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Application details not found. Cannot generate the certificate.",
      });
      return;
    }
    Swal.fire({
      title: "Generating Certificate...",
      text: "Please wait while we prepare your document.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await getCertificateDetails(survey.application_number);

      if (response?.status !== 0 || !response?.data) {
        throw new Error(response?.message || "Failed to fetch certificate details.");
      }
      const apiData = response.data;
      const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A";
        return date.toLocaleDateString("en-GB");
      };
      const fromDate = new Date(apiData.payment_date);
      const toDate = new Date(
        fromDate.getFullYear() + 10,
        fromDate.getMonth(),
        fromDate.getDate()
      );
      const mappedData = {
        licenseNo: apiData.application_number?.toString() || "N/A",
        licenseeName: apiData.shopowner_name || "N/A",
        relativeName: apiData.guardian_name || "N/A",
        addressLine1: `Stall No: ${apiData.holdingno_or_stall_no || "N/A"}`,
        po: apiData.haat_name || "Not Provided",
        dist: "JALPAIGURI",
        ps: apiData.police_station_name || "N/A",
        block: apiData.block_name || "Not Provided",
        licenseType:
          apiData.type_of_license === "1"
            ? "Commercial Only"
            : "Commercial with Residential",
        rent: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(apiData.amount || 0),
        fromDate: formatDate(apiData.payment_date),
        toDate: formatDate(toDate.toISOString()),
        landDetails: {
          mouza: apiData.mouza_name || "N/A",
          khatianNo: apiData.khatian_no?.toString() || "N/A",
          jlNo: apiData.jl_no?.toString() || "N/A",
          plotNo: apiData.plot_no?.toString() || "N/A",
          boundaries: {
            direction: apiData.boundaries_of_plot || "As per Survey Records",
          },
          holdingNo: apiData.holdingno_or_stall_no?.toString() || "N/A",
          area: apiData.area_of_holding_or_land?.toString() || "N/A",
          inLocation: apiData.haat_name || "N/A",
          policeStation: apiData.police_station_name || "N/A",
        },
      };

      const certificateContainer = document.createElement("div");
      certificateContainer.style.position = "fixed";
      certificateContainer.style.left = "-9999px";
      certificateContainer.style.top = "-9999px";
      document.body.appendChild(certificateContainer);

      type LicenseType = "Commercial Only" | "Commercial with Residential";
      const mappedDataWithType = {
        ...mappedData,
        licenseType: (mappedData.licenseType === "Commercial Only"
          ? "Commercial Only"
          : "Commercial with Residential") as LicenseType,
      };

      const root = createRoot(certificateContainer);
      root.render(<CertificateTemplate data={mappedDataWithType} />);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const pdfOptions = {
        margin: [0, 0, 0, 0],
        filename: `License-${mappedData.licenseNo}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: true,
        },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      const pdfDataUri = await html2pdf()
        .from(certificateContainer.children[0])
        .set(pdfOptions)
        .output("datauristring");

      setPdfUrl(pdfDataUri);
      setPdfFilename(pdfOptions.filename);
      setShowPdfPreviewModal(true);
      Swal.close();
      root.unmount();
      document.body.removeChild(certificateContainer);
    } catch (error) {
      console.error("Certificate generation failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Could not generate the certificate.";
      Swal.fire({
        icon: "error",
        title: "Generation Failed",
        text: errorMessage,
      });
    }
  };

  // Load Data Based on User Type
  const loadData = async () => {
    const userDetails = decodeJwtToken();
    if (!haatStatusId) return;
    if (dashboardType == "ADMIN" && userDetails?.UserTypeID == 100) {
      const result = await getHaatApplicantionDetailsForAdmin(haatStatusId);
      setData(result);
    } else if (dashboardType == "ADMIN" && userDetails?.UserTypeID == 50) {
      const result = await getCheckerDashboardDetails(haatStatusId);
      setData(result);
    } else if (dashboardType == "USER") {
      const result = await getSurveyDetailsByShopOwnerID(haatStatusId);
      setData(result);
    } else if (dashboardType == "ADMIN" && userDetails?.UserTypeID == 60) {
      const result = await getHearingDetailsByHearingUserID(haatStatusId);
      setData(result);
    } else if (dashboardType == "ADMIN" && userDetails?.UserTypeID == 70) {
      const result = await getSurveyDetailsByApprovalOfficerID(haatStatusId);
      setData(result);
    } else if (dashboardType == "ADMIN" && userDetails?.UserTypeID == 10) {
      const result = await getHaatManagerDashboardDtlsByHaatManagerID(haatStatusId);
      setData(result);
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    const userDetails = decodeJwtToken();
    setUserType(userDetails?.UserTypeID);
    loadData();
  }, [haatStatusId, paymentSuccess]);

  // Checkbox functionality
  const handleCheckboxChange = (surveyId: number) => {
    setSelectedSurveys((prev) =>
      prev.includes(surveyId)
        ? prev.filter((id) => id !== surveyId)
        : [...prev, surveyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSurveys.length === paginatedData.length) {
      setSelectedSurveys([]);
    } else {
      const allIds = paginatedData.map((survey: any) => survey.survey_id);
      setSelectedSurveys(allIds);
    }
  };

  const handleSubmitSelected = () => {
    if (selectedSurveys.length > 0) {
      setShowHearingModal(true);
    }
  };

  const handleHearingDateSubmit = async () => {
    if (!hearingDate) return;

    setLoading(true);
    try {
      const response = await saveHearingDateByCheckerID(selectedSurveys, hearingDate);
      if (response?.status == 0) {
        setPaymentSuccess(true);
        Swal.fire({
          title: "Hearing Date Initiated Successfully",
          text: "You clicked the button!",
          icon: "success",
        });
      }
      setLoading(false);
      setSelectedSurveys([]);
      setHearingDate("");
      setShowHearingModal(false);
    } catch (error) {
      alert("Something Went Wrong");
      console.error("Error updating hearing date:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalItems = data?.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedData = data?.slice(startIdx, endIdx);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const userDetails = decodeJwtToken();
    const response = await savePaymentDetailsBySurveyID(selectedSurvey, userDetails);
    if (response?.status == 0) {
      setPaymentSuccess(true);
      setShowPaymentModal(true);
    }
    setLoading(false);
    setLoads(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentSuccess(false);
    setPaymentName("");
    setPaymentNumber("");
    setPaymentEmail("");
    setLoads(false);
  };

  const closeHearingModal = () => {
    setShowHearingModal(false);
    setHearingDate("");
  };

  const closeRemarksModal = () => {
    setShowRemarksModal(false);
    setRemarksText("");
    setSelectedSurveyForRemarks(null);
  };

  // Handle Approval Actions
  const handleApprovalAction = (surveyId: number, action: "approve" | "reject") => {
    setSelectedSurveyForRemarks(surveyId);
    setApprovalAction(action);
    setRemarksText("");
    setShowRemarksModal(true);
  };

  const handleRemarksSubmit = async () => {
    if (remarksText.length < 10) {
      Swal?.fire({
        icon: "warning",
        title: "Invalid Input",
        text: "Remarks must be at least 10 characters long!",
      }) || alert("Remarks must be at least 10 characters long!");
      return;
    }
    if (!selectedSurveyForRemarks) return;
    setLoading(true);
    try {
      const response = await submitRemarksAction(
        selectedSurveyForRemarks,
        remarksText,
        approvalAction,
        userType
      );
      if (response?.status == 0) {
        setPaymentSuccess(true);
        Swal?.fire({
          icon: "success",
          title: "Success",
          text: `Survey ${approvalAction === "approve" ? "approved" : "rejected"
            } successfully!`,
        });
        setShowRemarksModal(false);
        setRemarksText("");
        setSelectedSurveyForRemarks(null);
        loadData();
      } else {
        Swal?.fire({
          icon: "error",
          title: "Error",
          text: `Failed to ${approvalAction} survey. Please try again.`,
        });
      }
    } catch (error) {
      alert("Something Went Wrong");
      Swal?.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Visibility flags
  const showCheckboxes = userType == 50 && haatStatusId == "2";
  const showApprovedButton =
    (userType == 60 && haatStatusId == "1") || (userType == 70 && haatStatusId == "2");
  const showViewButton =
    (userType == 60 && haatStatusId == "1") ||
    (userType == 50 && haatStatusId == "2") ||
    (userType == 70 && haatStatusId == "2");

  // Animation utility class for table row fade-in and hover scaling
  const rowAnimationClass =
    "animate-[fade-in_0.5s_ease-in-out] group hover:scale-[1.0125] hover:shadow-md hover:bg-gradient-to-r hover:from-blue-50/70 hover:to-indigo-50/50 transition-all duration-300";
  const buttonBaseAnimation =
    "transition-all duration-200 focus:scale-95 active:scale-95 active:shadow-md";
  const cardAnimation =
    "animate-[fade-in_0.9s_ease-in] shadow-2xl hover:shadow-2xl transition-all duration-500";
  const tableHeaderAnimation =
    "animate-[slide-down_0.5s_ease]";

  // Keyframes for animation
  React.useEffect(() => {
    // Keyframes in a style tag for basic fade and slide
    if (!document.getElementById("survey-table-animations")) {
      const style = document.createElement("style");
      style.id = "survey-table-animations";
      style.innerHTML = `
      @keyframes fade-in {
        0% {opacity:0; transform:translateY(30px);}
        100% {opacity:1; transform:translateY(0);}
      }
      @keyframes slide-down {
        0% {opacity:0; transform:translateY(-16px);}
        100% {opacity:1; transform:translateY(0);}
      }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-200">
      <div className="min-h-full fixed z-[0] w-full">
        <img
          src={bgimg}
          alt="background image"
          className="fixed left-0 top-20 w-full h-full object-cover opacity-[0.09] z-0 transition-opacity duration-700 ease-in"
          style={{ willChange: "opacity" }}
        />
      </div>
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header Section */}
        <div className={`mb-8`}>
          <button
            type="button"
            onClick={() => window?.history?.back()}
            className={
              "group mb-6 inline-flex items-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl border border-slate-200 font-medium " +
              buttonBaseAnimation
            }
          >
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 group-focus:-translate-x-1 transition-transform duration-200" />
            <span className="tracking-wide">Back</span>
          </button>

          <div className={`${tableHeaderAnimation} flex items-center gap-3 mb-2`}>
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight animate-[fade-in_1.1s_ease]">
              {title}
            </h1>
          </div>
          <p className="text-slate-600 ml-7 tracking-wide animate-[fade-in_1.2s_ease]">
            Manage and track survey records efficiently
          </p>
        </div>

        {/* Table Card */}
        <div className={`bg-white rounded-2xl ${cardAnimation} border border-slate-200 overflow-hidden backdrop-blur-sm bg-white/95`}>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            <table className="w-full">
              <thead>
                <tr className={`bg-gradient-to-r from-slate-800 to-slate-900 text-white ${tableHeaderAnimation}`}>
                  <th className="px-3 py-3 text-left w-10">
                    <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>#
                    </div>
                  </th>
                  {showCheckboxes && (
                    <th className="px-3 py-3 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition-shadow duration-150"
                          checked={
                            selectedSurveys.length === paginatedData.length &&
                            paginatedData.length > 0
                          }
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                  )}
                  <th className="px-3 py-3 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                      <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Building className="w-3 h-3 text-blue-400" />
                      </div>
                      Application No
                    </div>
                  </th>
                  {(userType === 70 && haatStatusId === "2") ? (
                    <th className="px-3 py-3 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                        <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Calendar className="w-3 h-3 text-green-400" />
                        </div>
                        Final Survey Date
                      </div>
                    </th>
                  ) : (userType === 1 && haatStatusId === "6") ? (
                    <th className="px-3 py-3 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                        <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Calendar className="w-3 h-3 text-green-400" />
                        </div>
                        Hearing Date
                      </div>
                    </th>
                  ) : (
                    <th className="px-3 py-3 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                        <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Calendar className="w-3 h-3 text-green-400" />
                        </div>
                        Survey Date
                      </div>
                    </th>
                  )}
                  {(userType == 60 && haatStatusId == "1") && (
                    <th className="px-3 py-3 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                        <div className="w-6 h-6 bg-violet-500/20 rounded-lg flex items-center justify-center">
                          <Calendar className="w-3 h-3 text-violet-400" />
                        </div>
                        Hearing Date
                      </div>
                    </th>
                  )}
                  <th className="px-3 py-3 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                      <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <Building className="w-3 h-3 text-orange-400" />
                      </div>
                      Haat Name
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                      <div className="w-6 h-6 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <User className="w-3 h-3 text-cyan-400" />
                      </div>
                      Shop Owner Name
                    </div>
                  </th>
                  {(userType === 70 && haatStatusId === "2") ? (
                    <th className="px-3 py-3 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                        <div className="w-6 h-6 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                          <IndianRupee className="w-3 h-3 text-indigo-400" />
                        </div>
                        Final Amount
                      </div>
                    </th>
                  ) : (
                    <th className="px-3 py-3 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                        <div className="w-6 h-6 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                          <Phone className="w-3 h-3 text-indigo-400" />
                        </div>
                        Mobile
                      </div>
                    </th>
                  )}
                  {(userType == 10 && (haatStatusId == "2" || haatStatusId == "3")) && (
                    <th className="px-3 py-3 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                        <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <IndianRupee className="w-3 h-3 text-green-400" />
                        </div>
                        Amount
                      </div>
                    </th>
                  )}
                  {haatStatusId == "9" && userType == 1 && (
                    <th className="px-3 py-3 text-left">
                      <div className="text-xs font-bold uppercase tracking-wide text-center">
                        Action
                      </div>
                    </th>
                  )}
                  {userType == 70 && haatStatusId == "4" && (
                    <th className="px-3 py-3 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                        <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Calendar className="w-3 h-3 text-purple-400" />
                        </div>
                        Final Payment Date
                      </div>
                    </th>
                  )}
                  {userType == 70 && haatStatusId == "4" && (
                    <th className="px-3 py-3 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                        <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Calendar className="w-3 h-3 text-purple-400" />
                        </div>
                        Reject Remark
                      </div>
                    </th>
                  )}
                  {userType == 70 && haatStatusId == "3" && (
                    <th className="px-3 py-3 text-left">
                      <div className="text-xs font-bold uppercase tracking-wide text-center">
                        Action
                      </div>
                    </th>
                  )}
                  {userType == 1 && haatStatusId == "10" && (
                    <>
                      <th className="px-3 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                          <div className="w-6 h-6 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                            <User className="w-3 h-3 text-cyan-400" />
                          </div>
                          Rejected From
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                          <div className="w-6 h-6 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                            <MessageSquareX className="w-3 h-3 text-cyan-400" />
                          </div>
                          Rejection Remarks
                        </div>
                      </th>
                    </>
                  )}
                  {userType == 70 && haatStatusId == "1" && (
                    <th className="px-3 py-3 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                        Action
                      </div>
                    </th>
                  )}
                  {userType == 1 && haatStatusId == "1" && (
                    <>
                      <th className="px-3 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                          <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <User className="w-3 h-3 text-blue-400" />
                          </div>
                          Application Status
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <div className="text-xs font-bold uppercase tracking-wide text-center">
                          Actions
                        </div>
                      </th>
                    </>
                  )}
                  {userType == 1 && haatStatusId == "7" && (
                    <th className="px-3 py-3 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                        <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <IndianRupee className="w-3 h-3 text-emerald-400" />
                        </div>
                        Amount
                      </div>
                    </th>
                  )}
                  {haatStatusId == "7" && userType == 1 && (
                    <th className="px-3 py-3 text-left">
                      <div className="text-xs font-bold uppercase tracking-wide text-center">
                        Actions
                      </div>
                    </th>
                  )}
                  {userType == 60 && haatStatusId == "2" && (
                    <>
                      <th className="px-3 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                          <div className="w-6 h-6 bg-rose-500/20 rounded-lg flex items-center justify-center">
                            <Calendar className="w-3 h-3 text-rose-400" />
                          </div>
                          Initial Payment Date
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                          <div className="w-6 h-6 bg-teal-500/20 rounded-lg flex items-center justify-center">
                            <User className="w-3 h-3 text-teal-400" />
                          </div>
                          Hearing Officer
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                          <div className="w-6 h-6 bg-violet-500/20 rounded-lg flex items-center justify-center">
                            <Calendar className="w-3 h-3 text-violet-400" />
                          </div>
                          Hearing Date
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <div className="text-xs font-bold uppercase tracking-wide text-center">
                          Actions
                        </div>
                      </th>
                    </>
                  )}
                  {userType == 60 && haatStatusId == "3" && (
                    <>
                      <th className="px-3 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                          <div className="w-6 h-6 bg-rose-500/20 rounded-lg flex items-center justify-center">
                            <Calendar className="w-3 h-3 text-rose-400" />
                          </div>
                          Initial Payment Date
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                          <div className="w-6 h-6 bg-violet-500/20 rounded-lg flex items-center justify-center">
                            <Calendar className="w-3 h-3 text-violet-400" />
                          </div>
                          Hearing Date
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                          <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <IndianRupee className="w-3 h-3 text-emerald-400" />
                          </div>
                          Initial Amount
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                          <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <IndianRupee className="w-3 h-3 text-emerald-400" />
                          </div>
                          Final Amount
                        </div>
                      </th>
                    </>
                  )}
                  {userType == 50 && (
                    <>
                      <th className="px-3 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                          <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Calendar className="w-3 h-3 text-blue-400" />
                          </div>
                          Payment Date
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                          <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <IndianRupee className="w-3 h-3 text-emerald-400" />
                          </div>
                          Initial Amount
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                          <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <IndianRupee className="w-3 h-3 text-emerald-400" />
                          </div>
                          Final Amount
                        </div>
                      </th>
                    </>
                  )}
                  {haatStatusId == "1" && userType == 50 && (
                    <th className="px-3 py-3 text-left">
                      <div className="text-xs font-bold uppercase tracking-wide text-center">
                        Actions
                      </div>
                    </th>
                  )}
                  {haatStatusId == "4" && userType == 1 && (
                    <>
                      <th className="px-3 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                          <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <IndianRupee className="w-3 h-3 text-emerald-400" />
                          </div>
                          Initial Payment Amount
                        </div>
                      </th>
                      <th className="px-3 py-3 text-left">
                        <div className="text-xs font-bold uppercase tracking-wide text-center">
                          Actions
                        </div>
                      </th>
                    </>
                  )}
                  {haatStatusId == "2" && userType == 70 && (
                    <th className="px-3 py-3 text-left">
                      <div className="text-xs font-bold uppercase tracking-wide text-center">
                        Actions
                      </div>
                    </th>
                  )}
                  {userType == 10 && (
                    <th className="px-3 py-3 text-left">
                      <div className="text-xs font-bold uppercase tracking-wide text-center">
                        Action
                      </div>
                    </th>
                  )}
                  {showApprovedButton && !(userType === 70) && (
                    <th className="px-3 py-3 text-left">
                      <div className="text-xs font-bold uppercase tracking-wide text-center">
                        Actions
                      </div>
                    </th>
                  )}
                  {!showApprovedButton && showViewButton && (
                    <th className="px-3 py-3 text-left">
                      <div className="text-xs font-bold uppercase tracking-wide text-center">
                        Actions
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData && paginatedData.length > 0 ? (
                  paginatedData.map((survey: any, index: number) => (
                    <tr
                      key={survey.survey_id}
                      className={rowAnimationClass}
                      style={{ animationDelay: `${0.08 * (index % ITEMS_PER_PAGE)}s` }}
                    >
                      <td className="px-3 py-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center text-slate-700 font-semibold text-xs">
                          {startIdx + index + 1}
                        </div>
                      </td>
                      {showCheckboxes && (
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            checked={selectedSurveys.includes(survey.survey_id)}
                            onChange={() =>
                              handleCheckboxChange(survey.survey_id)
                            }
                          />
                        </td>
                      )}
                      <td className="px-3 py-3">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                          {survey?.application_number}
                        </div>
                      </td>
                      {(userType === 70 && haatStatusId == "2") ? (
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <span className="text-slate-900 font-semibold text-xs">
                              {survey?.final_payment_date}
                            </span>
                          </div>
                        </td>
                      ) : (userType === 1 && haatStatusId == "6") ? (
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            {survey?.hearing_date ? (
                              <>
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                <span className="text-slate-900 font-semibold text-xs">
                                  {survey.hearing_date}
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                <span className="bg-red-100 text-red-800 border border-red-200 rounded-lg px-2 py-0.5 text-[10px]">
                                  Pending
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                      ) : (
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <span className="text-slate-900 font-semibold text-xs">
                              {survey?.survey_date}
                            </span>
                          </div>
                        </td>
                      )}
                      {(userType == 60 && haatStatusId == "1") && (
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-violet-400 rounded-full"></div>
                            <span className="text-slate-900 font-semibold text-xs">
                              {survey?.hearing_date}
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center">
                            <Building className="w-3.5 h-3.5 text-orange-600" />
                          </div>
                          <span className="text-slate-900 font-semibold text-xs">
                            {survey?.haat_name}
                          </span>
                        </div>
                      </td>
                      {(userType == 50 || userType == 10) ? (
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-cyan-600" />
                            </div>
                            <span className="text-slate-900 font-semibold text-xs">
                              {survey?.shopowner_name}
                            </span>
                          </div>
                        </td>
                      ) : (
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-cyan-600" />
                            </div>
                            <span className="text-slate-900 font-semibold text-xs">
                              {survey?.shop_owner_name}
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                            {(userType === 70 && haatStatusId === "2")
                              ? <IndianRupee className="w-3.5 h-3.5 text-indigo-600" />
                              : <Phone className="w-3.5 h-3.5 text-indigo-600" />}
                          </div>
                          <span className="text-slate-700 font-semibold text-xs">
                            {(userType === 70 && haatStatusId === "2") ? survey?.final_amount : survey?.mobile_number}
                          </span>
                        </div>
                      </td>
                      {haatStatusId == "4" && userType == 1 && (
                        <>
                          <td className="px-3 py-3">
                            <div className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                              <IndianRupee className="w-3 h-3 mr-0.5" />
                              {survey?.initial_amount}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => {
                                setShowPaymentModal(true);
                                setSelectedSurvey(survey);
                              }}
                              className="group inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-semibold text-[10px] shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                              <CreditCard className="w-3 h-3 mr-1 group-hover:rotate-12 transition-transform duration-200" />
                              Confirm & Pay
                            </button>
                          </td>
                        </>
                      )}
                      {(userType == 10 && haatStatusId == "2") && (
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                              <IndianRupee className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <span className="text-slate-900 font-semibold text-xs">
                              {survey?.initial_payment_amount}
                            </span>
                          </div>
                        </td>
                      )}
                      {(userType == 10 && haatStatusId == "3") && (
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                              <IndianRupee className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <span className="text-slate-900 font-semibold text-xs">
                              {survey?.final_payment_amount}
                            </span>
                          </div>
                        </td>
                      )}
                      {userType == 10 && (
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => handleViewClick(String(survey.survey_id))}
                            className="group inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-2.5 py-1.5 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                        </td>
                      )}
                      {haatStatusId == "9" && userType == 1 && (
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => handleDownloadClick(survey)}
                            className="group inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-lg font-semibold text-[10px] shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Certificate
                          </button>
                        </td>
                      )}
                      {userType == 70 && haatStatusId == "3" && (
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => handleViewClick(String(survey.survey_id))}
                            className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                          </button>
                        </td>
                      )}
                      {userType == 70 && haatStatusId == "4" && (
                        <>
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                              <Calendar className="w-4 h-4 mr-1" />
                              {survey?.final_payment_date}
                            </div>
                          </td>
                          {/* <td className="px-6 py-5">
                            <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {survey?.initial_amount}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {survey?.final_amount}
                            </div>
                          </td> */}
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {survey?.remarks}
                            </div>
                          </td>
                        </>
                      )}
                      {userType == 1 && haatStatusId == "10" && (
                        <>
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                              <User2Icon className="w-4 h-4 mr-1" />
                              {survey?.rejected_by_name}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                              <MessageSquareX className="w-4 h-4 mr-1" />
                              {survey?.rejection_remarks}
                            </div>
                          </td>
                        </>
                      )}
                      {userType == 1 && haatStatusId == "1" && (
                        <>
                          <td className="px-6 py-5">
                            <div
                              className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border ${survey?.application_status == 1 ||
                                survey?.application_status == 2 ||
                                survey?.application_status == 3
                                ? "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200"
                                : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
                                }`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full mr-2 ${survey?.application_status == 1 ||
                                  survey?.application_status == 2 ||
                                  survey?.application_status == 3
                                  ? "bg-red-500"
                                  : "bg-green-500"
                                  }`}
                              />
                              {survey?.application_status == 1 && "Initial Payment Pending"}
                              {survey?.application_status == 2 && "Change Request"}
                              {survey?.application_status == 3 && "Hearing Pending"}
                              {survey?.application_status == 4 && "Hearing Scheduled"}
                              {survey?.application_status == 5 && "Hearing Approved"}
                              {survey?.application_status == 6 && "Final Payment Done"}
                              {survey?.application_status == 7 && "License Issued"}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <button
                              onClick={() => handleViewClick(String(survey.survey_id))}
                              className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </>
                      )}
                      {userType == 70 && haatStatusId == "1" && (
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => handleViewClick(String(survey.survey_id))}
                            className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                          </button>
                        </td>
                      )}
                      {userType == 1 && haatStatusId == "7" && (
                        <td className="px-6 py-5">
                          <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            {survey?.final_amount}
                          </div>
                        </td>
                      )}
                      {haatStatusId == "7" && userType == 1 && (
                        <td className="px-6 py-5">
                          <button
                            onClick={() => {
                              setShowPaymentModal(true);
                              setSelectedSurvey(survey);
                            }}
                            className="group inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <CreditCard className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                            Confirm & Pay
                          </button>
                        </td>
                      )}
                      {userType == 60 && haatStatusId == "2" && (
                        <>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                              <span className="text-slate-900 font-semibold">
                                {survey?.initial_paymentdate}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-teal-600" />
                              </div>
                              <span className="text-slate-900 font-semibold">
                                {survey?.hearing_officername}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                              <span className="text-slate-900 font-semibold">
                                {survey?.hearing_date}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <button
                              onClick={() => handleViewClick(String(survey.survey_id))}
                              className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </>
                      )}
                      {userType == 60 && haatStatusId == "3" && (
                        <>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                              <span className="text-slate-900 font-semibold">
                                {survey?.initial_paymentdate}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                              <span className="text-slate-900 font-semibold">
                                {survey?.hearing_date}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {survey?.initial_amount}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {survey?.final_amount}
                            </div>
                          </td>
                        </>
                      )}
                      {haatStatusId == "5" && (
                        <td className="px-6 py-5">
                          <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            {survey?.initial_amount}
                          </div>
                        </td>
                      )}
                      {userType == 50 && (
                        <>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-slate-900 font-semibold">
                                {survey?.payment_date ? survey.payment_date : "Pending"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {survey?.initial_amount}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {survey?.final_amount}
                            </div>
                          </td>
                        </>
                      )}
                      {userType == 50 && haatStatusId == "1" && (
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => handleViewClick(String(survey.survey_id))}
                            className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                          </button>
                        </td>
                      )}
                      {showApprovedButton && (
                        <td className="px-3 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprovalAction(survey.survey_id, "approve")}
                              className="group inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 p-1 w-6 h-6"
                              style={{
                                minWidth: "1.5rem",
                                minHeight: "1.5rem",
                                maxWidth: "1.5rem",
                                maxHeight: "1.5rem",
                              }}
                              title="Approve"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleApprovalAction(survey.survey_id, "reject")}
                              className="group inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 p-1 w-6 h-6"
                              style={{
                                minWidth: "1.5rem",
                                minHeight: "1.5rem",
                                maxWidth: "1.5rem",
                                maxHeight: "1.5rem",
                              }}
                              title="Reject"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {showViewButton && (
                              <button
                                onClick={() => handleViewClick(String(survey.survey_id))}
                                className="group inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-2.5 py-1.5 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                              >
                                <Eye className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                      {!showApprovedButton && showViewButton && (
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => handleViewClick(String(survey.survey_id))}
                            className="group inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-2.5 py-1.5 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            <span className="text-[10px]">View</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr className={rowAnimationClass} style={{ animationDelay: "0s" }}>
                    <td
                      colSpan={
                        Number(haatStatusId) === 4
                          ? 7
                          : showApprovedButton
                            ? 7
                            : showViewButton
                              ? 7
                              : 6
                      }
                      className="text-center py-16"
                    >
                      <div className="flex flex-col items-center justify-center h-full w-full animate-[fade-in_0.8s_ease]">
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6">
                          <Building className="w-10 h-10 text-slate-400 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 animate-fade-in">
                          No Data Available
                        </h3>
                        <p className="text-slate-500 text-lg animate-fade-in">
                          No survey records found for the selected criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Submit Button for Selected Items */}
          {showCheckboxes && selectedSurveys.length > 0 && (
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-200 animate-[slide-down_0.4s_ease]">
              <div className="flex items-center justify-between animate-[fade-in_0.7s_ease]">
                <p className="text-sm text-slate-700 font-semibold">
                  <span className="font-bold text-blue-600">
                    {selectedSurveys.length}
                  </span>{" "}
                  items selected
                </p>
                <button
                  onClick={handleSubmitSelected}
                  className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${buttonBaseAnimation}`}
                >
                  <Send className="w-4 h-4 mr-2 animate-fade-in" />
                  Submit Selected ({selectedSurveys.length})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- Animation for pagination controls below the table --- */}
        <div className="flex justify-end mt-5 animate-[slide-down_0.5s_ease]">
          <nav className="inline-flex rounded-lg overflow-hidden shadow border border-slate-200 bg-white">
            <button
              className={`${buttonBaseAnimation} px-4 py-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 focus:bg-blue-50 transition group`}
              disabled={currentPage <= 1}
              style={{ opacity: currentPage <= 1 ? 0.5 : 1 }}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
            <span className="px-5 py-2 text-blue-700 font-bold text-lg bg-gradient-to-br from-blue-50 to-white animate-[fade-in_0.5s_ease]">
              Page {currentPage} / {totalPages || 1}
            </span>
            <button
              className={`${buttonBaseAnimation} px-4 py-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 focus:bg-blue-50 transition group`}
              disabled={currentPage >= totalPages}
              style={{ opacity: currentPage >= totalPages ? 0.5 : 1 }}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </nav>
        </div>

        {/* Modals */}
        <PaymentModal
          show={showPaymentModal}
          onClose={closePaymentModal}
          selectedSurvey={selectedSurvey}
          paymentName={paymentName}
          setPaymentName={setPaymentName}
          paymentNumber={paymentNumber}
          setPaymentNumber={setPaymentNumber}
          paymentEmail={paymentEmail}
          setPaymentEmail={setPaymentEmail}
          loading={loading}
          loads={loads}
          paymentSuccess={paymentSuccess}
          onSubmit={handlePaymentSubmit}
          userType={userType}
          haatStatusId={haatStatusId}
        />
        <HearingModal
          show={showHearingModal}
          onClose={closeHearingModal}
          hearingDate={hearingDate}
          setHearingDate={setHearingDate}
          selectedSurveys={selectedSurveys}
          loading={loading}
          onSubmit={handleHearingDateSubmit}
        />
        <RemarksModal
          show={showRemarksModal}
          onClose={closeRemarksModal}
          remarksText={remarksText}
          setRemarksText={setRemarksText}
          approvalAction={approvalAction}
          loading={loading}
          onSubmit={handleRemarksSubmit}
        />
        <ViewDetailsModal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isLoading={isLoadingDetails}
          selectedDetails={selectedDetails}
        />
        <PdfPreviewModal
          show={showPdfPreviewModal}
          onClose={() => {
            setShowPdfPreviewModal(false);
            setPdfUrl(null);
          }}
          pdfUrl={pdfUrl}
          pdfFilename={pdfFilename}
        />
      </div>
    </div>
  );
};

export default SurveyTable;