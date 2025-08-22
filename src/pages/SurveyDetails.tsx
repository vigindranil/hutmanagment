"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { commonApi, commonApiImage } from '../commonAPI';
import { decodeJwtToken } from '../utils/decodeToken';
import { ChevronLeft, ChevronRight, CreditCard, X, CheckCircle, Calendar, Building, User, Phone, IndianRupee, Send, Check, MessageSquare, Eye } from 'lucide-react';
import { Dialog } from "@headlessui/react";
import Cookies from "js-cookie";
import Swal from 'sweetalert2';
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
import bgimg from '../../src/assets/table background.jpg'

interface SurveyData {
  survey_id: number;
  survey_date: string;
  application_number: string;
  haat_id: number;
  haat_name: string;
  shop_owner_name: string;
  mobile_number: string;
  survey_status: string;
  amount: number;
  initial_amount: number;
  final_amount: number;
}

interface viewSurveyData {
  survey_id: number,
  license_type: number,
  application_status: number,
  user_id: number,
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
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<FullApplicationDetails | null>(null);
  const [paymentName, setPaymentName] = useState('');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [paymentEmail, setPaymentEmail] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(1);
  const [loads, setLoads] = useState(false);

  const [hearingDate, setHearingDate] = useState('');
  const [selectedSurveys, setSelectedSurveys] = useState<number[]>([]);
  const [approvalLoading, setApprovalLoading] = useState<number | null>(null);
  const [hearingRemarks, setHearingRemarks] = useState<string>("");
  const [remarksText, setRemarksText] = useState<string>("");
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [selectedSurveyForRemarks, setSelectedSurveyForRemarks] = useState<number | null>(null);
  const [viewData, setViewData] = useState<viewSurveyData | null>(null);

  const [isLoadingDetails, setisLoadingDetails] = useState(false);

  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleViewClick = async (surveyId: string) => {
    try {
      setIsModalOpen(true);
      setisLoadingDetails(true);
      const token = Cookies.get('token'); // get fresh token
      const myHeaders = new Headers();
      myHeaders.append("accept", "*/*");
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON?.stringify({ surveyID: parseInt(surveyId) });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect,
      };
      const response: any = await fetch(BASE_API_URL + "user/getHaatApplicationDetailsBySurveyID", requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP ${response?.status}: ${await response?.text()}`);
      }
      const result = await response.json();
      const stall_image1 = await commonApiImage(result?.data?.stall_image1 || "");
      const stall_image2 = await commonApiImage(result?.data?.stall_image2 || "");
      const pan_image = await commonApiImage(result?.data?.pan_image || "");
      const sketch_map_attached = await commonApiImage(result?.data?.sketch_map_attached || "");
      const document_image = await commonApiImage(result?.data?.document_image || "");
      const residential_certificate_attached = await commonApiImage(result?.data?.residential_certificate_attached || "");
      const trade_license_attached = await commonApiImage(result?.data?.trade_license_attached || "");
      const affidavit_attached = await commonApiImage(result?.data?.affidavit_attached || "");
      const warision_certificate_attached = await commonApiImage(result?.data?.warision_certificate_attached || "");
      const death_certificate_attached = await commonApiImage(result?.data?.death_certificate_attached || "");
      const noc_legal_heirs_attached = await commonApiImage(result?.data?.noc_legal_heirs_attached || "");

      setSelectedDetails({ ...result?.data, stall_image1, stall_image2, pan_image, sketch_map_attached, residential_certificate_attached, document_image, trade_license_attached, affidavit_attached, warision_certificate_attached, noc_legal_heirs_attached, death_certificate_attached });
    } catch (error) {
      console.error("Error fetching full details:", error);
      alert("Failed to fetch application details. Make sure your credentials/token are valid.");
    }
    finally
    {
      setisLoadingDetails(false);
    }
  };

  const getHaatApplicantionDetailsForAdmin = async (haatStatusId: any) => {
    const userDetails = decodeJwtToken();
    const payload = {
      userID: userDetails?.UserID,
      from_date: null,
      to_date: null,
      haatDashoardStatus: haatStatusId,
    };
    const response = await commonApi(`user/getHaatApplicantionDetailsForAdmin`, payload);
    setData(response?.data || []);
    setCurrentPage(1);
  };

  const getCheckerDashboardDetails = async (haatStatusId: any) => {
    const userDetails = decodeJwtToken();

    const response = await commonApi(`user/getCheckerDashboardDetails?CheckerDashboardStatus=${haatStatusId}&UserID=${userDetails?.UserID}`);
    setData(response?.data || []);
    setCurrentPage(1);
  };

  const savePaymentDetailsBySurveyID = async () => {
    setLoading(true);
    const userDetails = decodeJwtToken();
    const payload = {
      // initial_or_final_payment_status: selectedSurvey?.survey_status === 'INITIAL' ? 1 : selectedSurvey?.survey_status === 'FINAL' ? 2 : undefined,
      initial_or_final_payment_status: selectedSurvey?.survey_status === "1" ? 1 : selectedSurvey?.survey_status === "5" ? 2 : undefined,
      survey_id: selectedSurvey?.survey_id,
      amount: selectedSurvey?.amount ?? 0,
      user_id: userDetails?.UserID,
  };


    console.log("selecterd ",selectedSurvey);
    
    const response = await commonApi(`user/savePaymentDetailsBySurveyID`, payload);
    if (response?.status == 0) {
      setPaymentSuccess(true);
      setShowPaymentModal(false);
    }
    setLoading(false);
  };

  // console.log ("payment",paymentSuccess);



  

  const getSurveyDetailsByShopOwnerID = async (haatStatusId: any) => {
    const userDetails = decodeJwtToken();
    const payload = {
      userID: userDetails?.UserID,
      from_date: null,
      to_date: null,
      haatDashoardStatus: haatStatusId,
    };
    const response = await commonApi(
      `user/getSurveyDetailsByShopOwnerID?UserDashboardStatus=${haatStatusId}&ShopOwnerID=${userDetails?.UserID}`,
      payload
    );
    setData(response?.data || []);
    setCurrentPage(1);
  };

  const getHearingDetailsByHearingUserID = async (haatStatusId: any) => {
    const userDetails = decodeJwtToken();

    const response = await commonApi(`user/getHearingDetailsByHearingUserID?HearingStateStatus=${haatStatusId}&UserID=${userDetails?.UserID}`);
    setData(response?.data || []);
    setCurrentPage(1);
  };

  const handleViewDetails = async (surveyId: number) => {
    setLoading(true);
    try {
      const response = await commonApi(`user/getHaatApplicationDetailsBySurveyID?survey_id=${surveyId}`, {});
      if (response?.status === 0) {
        setViewData(response.data);
        setShowViewModal(true);
      } else {
        // @ts-ignore
        window.Swal?.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch details. Please try again.',
        }) || alert('Failed to fetch details. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching survey details:', error);
      // @ts-ignore
      window.Swal?.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again.',
      }) || alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Function to handle approve/reject button clicks
  const handleApprovalAction = (surveyId: number, action: 'approve' | 'reject') => {
    setSelectedSurveyForRemarks(surveyId);
    setApprovalAction(action);
    setRemarksText("");
    setShowRemarksModal(true);
  };

  // Function to handle remarks submission
  const handleRemarksSubmit = async () => {
    if (remarksText.length < 10) {
      // @ts-ignore
      window.Swal?.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Remarks must be at least 10 characters long!',
      }) || alert("Remarks must be at least 10 characters long!");
      return;
    }

    if (!selectedSurveyForRemarks) return;

    setLoading(true);
    try {
      const userDetails = decodeJwtToken();
      const payload = {
        survey_id: selectedSurveyForRemarks,
        entry_user_id: userDetails?.UserID,
        hearing_remarks: remarksText,
        approval_status: approvalAction === 'approve' ? 1 : 2,
      };
      const response = await commonApi(`/user/updateApprovedHearingDetailsByHearingUserID`, payload);
      console.log(response);
      if (response?.status == 0) {
        setPaymentSuccess(true);
      }
      setLoading(false);

      if (response?.status == 0) {
        // @ts-ignore
        window.Swal?.fire({
          icon: 'success',
          title: 'Success',
          text: `Survey ${approvalAction === 'approve' ? 'approved' : 'rejected'} successfully!`,
        }) || alert(`Survey ${approvalAction === 'approve' ? 'approved' : 'rejected'} successfully!`);

        // Close modal and refresh data
        setShowRemarksModal(false);
        setPaymentSuccess(true);
        setRemarksText("");
        setSelectedSurveyForRemarks(null);

        // Refresh the data
        const userDetails = decodeJwtToken();
        if (haatStatusId && dashboardType == "ADMIN" && userDetails?.UserTypeID == 50) {
          getCheckerDashboardDetails(haatStatusId);
        }
      } else {
        // @ts-ignore
        window.Swal?.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to ${approvalAction} survey. Please try again.`,
        }) || alert(`Failed to ${approvalAction} survey. Please try again.`);
      }
    } catch (error) {
      console.error(`Error ${approvalAction}ing survey:`, error);
      // @ts-ignore
      window.Swal?.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again.',
      }) || alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userDetails = decodeJwtToken();
    setUserType(userDetails?.UserTypeID);
    if (haatStatusId && dashboardType == "ADMIN" && userDetails?.UserTypeID == 100) {
      getHaatApplicantionDetailsForAdmin(haatStatusId);
    }
    else if (haatStatusId && dashboardType == "ADMIN" && userDetails?.UserTypeID == 50) {
      getCheckerDashboardDetails(haatStatusId);
    }
    else if (haatStatusId && dashboardType == "USER") {
      getSurveyDetailsByShopOwnerID(haatStatusId);
    }
    else if (haatStatusId && dashboardType == "ADMIN" && userDetails?.UserTypeID == 60) {
      getHearingDetailsByHearingUserID(haatStatusId);
    }
  }, [haatStatusId, paymentSuccess]);

  // Checkbox functionality
  const handleCheckboxChange = (surveyId: number) => {
    setSelectedSurveys(prev =>
      prev.includes(surveyId)
        ? prev.filter(id => id !== surveyId)
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

      const userDetails = decodeJwtToken();
      // Add your API call here to update hearing dates for selected surveys
      console.log('Selected Survey IDs:', selectedSurveys);
      console.log('Hearing Date:', hearingDate);

      const response = await commonApi('user/saveHearingDateByCheckerID', {
        lstSurveyId: selectedSurveys,
        entry_user_id: userDetails?.UserID,
        hearing_date: hearingDate,
      });
      if (response?.status == 0) {
        setPaymentSuccess(true);
      
        Swal.fire({
          title: "Hearing Date Initiated Successfully",
          text: "You clicked the button!",
          icon: "success"
        }); 
      }
      setLoading(false);

      // Reset selections and close modal
      setSelectedSurveys([]);
      setHearingDate('');
      setShowHearingModal(false);
    } catch (error) {
      alert("Something Went Wrong");
      console.error('Error updating hearing date:', error);
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
    await savePaymentDetailsBySurveyID();
    setShowPaymentModal(true);
    setLoads(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentSuccess(false);
    setPaymentName('');
    setPaymentNumber('');
    setPaymentEmail('');
    setLoads(false);
  };

  const closeHearingModal = () => {
    setShowHearingModal(false);
    setHearingDate('');
  };

  const closeRemarksModal = () => {
    setShowRemarksModal(false);
    setRemarksText('');
    setSelectedSurveyForRemarks(null);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewData(null);
  };




  console.log("payment succ", typeof paymentSuccess);

  // Check if checkboxes should be shown
  const showCheckboxes = userType == 50 && haatStatusId == "2";

  // Check if approved button should be shown
  const showApprovedButton = userType == 60 && haatStatusId == "1";
  // Check if view button should be shown
  // REWRITE: Show view button for userType 50 and haatStatusId == "2"
  const showViewButton = (userType == 60 && haatStatusId == "1") || (userType == 50 && haatStatusId == "2");

  return (
    <div className="min-h-screen">
      <div className="min-h-full fixed z-[0] w-full">
      <img
              src={bgimg}
              alt="background image"
              className="bg-cover bg-center bg-no-repeat opacity-15"
            />
      </div>
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => window?.history?.back()}
            className="group mb-6 inline-flex items-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl shadow-sm hover:shadow-md border border-slate-200 transition-all duration-200 font-medium"
          >
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
          </div>
          <p className="text-slate-600 ml-7">Manage and track survey records efficiently</p>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden backdrop-blur-sm bg-white/95">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  {/* Table data count column */}
                  <th className="px-4 py-5 text-left w-12">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      #
                    </div>
                  </th>
                  {showCheckboxes && (
                    <th className="px-6 py-5 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          checked={selectedSurveys.length === paginatedData.length && paginatedData.length > 0}
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                  )}

                  <th className="px-6 py-5 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Application No
                    </div>
                  </th>

                  <th className="px-6 py-5 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      <Calendar className="w-4 h-4" />
                      Survey Date
                    </div>
                  </th>

                  {(userType == 60 && haatStatusId == "1") && (
                    <th className="px-6 py-5 text-left">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        <IndianRupee className="w-4 h-4" />
                        Hearing Date
                      </div>
                    </th>
                  )}

                  <th className="px-6 py-5 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      <Building className="w-4 h-4" />
                      Haat Name
                    </div>
                  </th>

                  <th className="px-6 py-5 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      <User className="w-4 h-4" />
                      Shop Owner Name
                    </div>
                  </th>

                  <th className="px-6 py-5 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      <Phone className="w-4 h-4" />
                      Mobile
                    </div>
                  </th>

                  {(userType == 1 && haatStatusId == "7") && (
                    <th className="px-6 py-5 text-left">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        <IndianRupee className="w-4 h-4" />
                        Amount
                      </div>
                    </th>
                  )}

                  {(haatStatusId == "7" && userType == 1) && (
                    <>
                      <th className="px-6 py-5 text-left">
                        <div className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                          Actions
                        </div>
                      </th>
                    </>
                  )}


                  {(userType == 60 && haatStatusId == "1") && (
                    <th className="px-6 py-5 text-left">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        <IndianRupee className="w-4 h-4" />
                        Amount
                      </div>
                    </th>
                  )}

                  {(userType == 60 && haatStatusId == "2") && (
                    <>
                      <th className="px-6 py-5 text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                          <IndianRupee className="w-4 h-4" />
                          Initial Payment Date
                        </div>
                      </th>

                      <th className="px-6 py-5 text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                          <IndianRupee className="w-4 h-4" />
                          Hearing Officername
                        </div>
                      </th>

                      <th className="px-6 py-5 text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                          <IndianRupee className="w-4 h-4" />
                          Hearing Date
                        </div>
                      </th>

                      <th className="px-6 py-5 text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                          <IndianRupee className="w-4 h-4" />
                          Hearing Remarks
                        </div>
                      </th>

                      <th className="px-6 py-5 text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                          <IndianRupee className="w-4 h-4" />
                          Initial Amount
                        </div>
                      </th>
                    </>
                  )}

                  {(haatStatusId == "5") && (
                    <>
                      <th className="px-6 py-5 text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                          <IndianRupee className="w-4 h-4" />
                          Amount
                        </div>
                      </th>
                    </>
                  )}
                  {(userType == 50) && (
                    <>
                      <th className="px-6 py-5 text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                          <Calendar className="w-4 h-4" />
                          Payment Date
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                          <IndianRupee className="w-4 h-4" />
                          Amount
                        </div>
                      </th>
                    </>
                  )}
                  {(haatStatusId == "4" && userType == 1) && (
                    <>
                      <th className="px-6 py-5 text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                          <IndianRupee className="w-4 h-4" />
                          Amount
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left">
                        <div className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                          Actions
                        </div>
                      </th>
                    </>
                  )}
                  {showApprovedButton && (
                    <th className="px-6 py-5 text-left">
                      <div className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        Actions
                      </div>
                    </th>
                  )}
                  {/* Add Actions column for view button for userType 50 and haatStatusId == 2 */}
                  {showViewButton && !showApprovedButton && (
                    <th className="px-6 py-5 text-left">
                      <div className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
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
                      className="group hover:bg-blue-50/50 transition-colors duration-200"
                    >
                      {/* Table data count cell */}
                      <td className="px-4 py-4 text-slate-500 font-semibold text-sm">
                        {startIdx + index + 1}
                      </td>
                      {showCheckboxes && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            checked={selectedSurveys.includes(survey.survey_id)}
                            onChange={() => handleCheckboxChange(survey.survey_id)}
                          />
                        </td>
                      )}

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {survey?.application_number}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-slate-900 font-medium">{survey?.survey_date}</span>
                      </td>

                      {userType == 60 && haatStatusId == "1" && (
                        <>
                          <td className="px-6 py-4">
                            <span className="text-slate-900 font-medium">{survey?.hearing_date}</span>
                          </td>
                        </>
                      )}

                      <td className="px-6 py-4">
                        <span className="text-slate-900 font-medium">{survey?.haat_name}</span>
                      </td>

                      {(userType == 50) ? <td className="px-6 py-4"><span className="text-slate-900 font-medium">{survey?.shopowner_name}</span></td> : <td className="px-6 py-4"><span className="text-slate-900 font-medium">{survey?.shop_owner_name}</span></td>}

                      <td className="px-6 py-4">
                        <span className="text-slate-600 font-medium">{survey?.mobile_number}</span>
                      </td>

                      {userType == 1 && haatStatusId == "7" && (
                        <>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-800">
                              ₹{survey?.final_amount}
                            </span>
                          </td>
                        </>
                      )}

                      {(haatStatusId == "7" && userType == 1) && (
                        <>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setShowPaymentModal(true);
                                setSelectedSurvey(survey);
                              }}
                              className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                              <CreditCard className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                              Pay Now
                            </button>
                          </td>
                        </>
                      )}


                      {(userType == 60 && haatStatusId == "1") && (
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-800">
                            ₹{survey?.initial_amount}
                          </span>
                        </td>
                      )}

                      {userType == 60 && haatStatusId == "2" && (
                        <>
                          <td className="px-6 py-4">
                            <span className="text-slate-900 font-medium">{survey?.initial_paymentdate}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-900 font-medium">{survey?.hearing_officername}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-900 font-medium">{survey?.hearing_date}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-900 font-medium">{survey?.hearing_remarks}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-800">
                              ₹{survey?.initial_amount}
                            </span>
                          </td>
                        </>
                      )}

                      {haatStatusId == "5" && (
                        <>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-800">
                              ₹{survey?.initial_amount}
                            </span>
                          </td>
                        </>
                      )}

                      {userType == 50 && (
                        <>
                          <td className="px-6 py-4">
                            <span className="text-slate-900 font-medium">{survey?.payment_date}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-900 font-medium">{survey?.initial_amount}</span>
                          </td>
                        </>
                      )}

                      {(haatStatusId == "4" && userType == 1) && (
                        <>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-800">
                              ₹{survey?.initial_amount}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setShowPaymentModal(true);
                                setSelectedSurvey(survey);
                              }}
                              className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                              <CreditCard className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                              Pay Now
                            </button>
                          </td>
                        </>
                      )}


                      {showApprovedButton && (
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => handleApprovalAction(survey.survey_id, 'approve')}
                            className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApprovalAction(survey.survey_id, 'reject')}
                            className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                          >
                            Reject
                          </button>
                          {showViewButton && (
                            <button
                              onClick={() => handleViewClick(survey.survey_id)}
                              className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </button>
                          )}
                        </td>
                      )}

                      {/* Show view button for userType 50 and haatStatusId == 2, if not already shown in showApprovedButton */}
                      {!showApprovedButton && showViewButton && (
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => handleViewClick(survey.survey_id)}
                            className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
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
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                          <Building className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Data Available</h3>
                        <p className="text-slate-500">No survey records found for the selected criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Submit Button for Selected Items */}
          {showCheckboxes && selectedSurveys.length > 0 && (
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">{selectedSurveys.length}</span> items selected
                </p>
                <button
                  onClick={handleSubmitSelected}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Selected ({selectedSurveys.length})
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-700">
                  Showing <span className="font-semibold">{startIdx + 1}</span> to{' '}
                  <span className="font-semibold">{Math.min(endIdx, totalItems)}</span> of{' '}
                  <span className="font-semibold">{totalItems}</span> results
                </p>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === 1
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-slate-50 shadow-sm hover:shadow border border-slate-200'
                      }`}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else {
                        const start = Math.max(1, currentPage - 2);
                        const end = Math.min(totalPages, start + 4);
                        pageNumber = start + i;
                        if (pageNumber > end) return null;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === pageNumber
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                            : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                            }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === totalPages
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-slate-50 shadow-sm hover:shadow border border-slate-200'
                      }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform animate-in slide-in-from-bottom-4 duration-300">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Payment Details</h2>
                  </div>
                </div>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  onClick={closePaymentModal}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* PAyment Modal Content */}
              <div className="p-6">

                {(loads && typeof paymentSuccess === "boolean")  ? (
                  paymentSuccess === true ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Payment Successful!</h3>
                      <p className="text-slate-600">Your payment has been processed successfully.</p>
                    </div>
                  
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Payment Failed!</h3>
                      <p className="text-slate-600">Your payment could not be processed. Please try again.</p>
                    </div>
                  )
                ) : (
                  
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {/* Amount Display */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Amount to Pay</span>
                        <span className="text-2xl font-bold text-slate-900">
                          ₹
                          {(userType == 1 && haatStatusId == "7")
                            ? selectedSurvey?.final_amount
                            : (userType == 1 && haatStatusId == "4")
                              ? selectedSurvey?.initial_amount
                              : ""}
                        </span>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-slate-50 focus:bg-white"
                          placeholder="Enter your full name"
                          value={paymentName}
                          onChange={e => setPaymentName(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-slate-50 focus:bg-white"
                          placeholder="Enter your mobile number"
                          value={paymentNumber}
                          onChange={e => setPaymentNumber(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-slate-50 focus:bg-white"
                          placeholder="Enter your email address"
                          value={paymentEmail}
                          onChange={e => setPaymentEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        'Complete Payment'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hearing Date Modal */}
        {showHearingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform animate-in slide-in-from-bottom-4 duration-300">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Select Hearing Date</h2>
                    <p className="text-sm text-slate-600">Choose a hearing date for selected surveys</p>
                  </div>
                </div>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  onClick={closeHearingModal}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="space-y-6">
                  {/* Selected Count Display */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Selected Surveys</span>
                      <span className="text-2xl font-bold text-slate-900">{selectedSurveys.length}</span>
                    </div>
                  </div>

                  {/* Date Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Hearing Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-slate-50 focus:bg-white"
                      value={hearingDate}
                      onChange={e => setHearingDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]} // Set minimum date to today
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeHearingModal}
                      className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleHearingDateSubmit}
                      disabled={!hearingDate || loading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        'Go'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remarks Modal */}
        {showRemarksModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform animate-in slide-in-from-bottom-4 duration-300">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${approvalAction === 'approve'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'bg-gradient-to-r from-red-500 to-pink-600'
                    }`}>
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {approvalAction === 'approve' ? 'Approve Survey' : 'Reject Survey'}
                    </h2>
                    <p className="text-sm text-slate-600">Please provide remarks (minimum 10 characters)</p>
                  </div>
                </div>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  onClick={closeRemarksModal}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="space-y-6">
                  {/* Action Status Display */}
                  <div className={`rounded-xl p-4 border ${approvalAction === 'approve'
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100'
                    : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-100'
                    }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Action</span>
                      <span className={`text-xl font-bold ${approvalAction === 'approve' ? 'text-green-700' : 'text-red-700'
                        }`}>
                        {approvalAction === 'approve' ? 'APPROVE' : 'REJECT'}
                      </span>
                    </div>
                  </div>

                  {/* Remarks Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Remarks <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-slate-50 focus:bg-white resize-none"
                      placeholder="Enter your remarks here (minimum 10 characters)..."
                      value={remarksText}
                      onChange={e => setRemarksText(e.target.value)}
                      rows={4}
                      required
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${remarksText.length >= 10 ? 'text-green-600' : 'text-red-500'
                        }`}>
                        {remarksText.length >= 10 ? '✓ Valid length' : `${10 - remarksText.length} characters needed`}
                      </span>
                      <span className="text-xs text-slate-500">
                        {remarksText.length}/500 characters
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeRemarksModal}
                      className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleRemarksSubmit}
                      disabled={remarksText.length < 10 || loading}
                      className={`flex-1 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl ${approvalAction === 'approve'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500'
                        : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-slate-400 disabled:to-slate-500'
                        }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        'OK'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform animate-in slide-in-from-bottom-4 duration-300">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Survey Details</h2>
                    <p className="text-sm text-slate-600">Viewing application details</p>
                  </div>
                </div>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  onClick={closeViewModal}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL */}

        
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-[9999]">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-8">
            <Dialog.Panel className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-8 shadow-2xl overflow-y-auto max-h-[95vh] border-2 border-blue-400">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-2xl font-extrabold text-blue-700 tracking-wide">
                  Application Details
                </Dialog.Title>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>

              {/* Loader when data is loading */}
              {isLoadingDetails ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <div className="text-blue-700 font-semibold text-lg">Loading details...</div>
                </div>
              ) : selectedDetails ? (
                <div className="space-y-8">
                  {/* Reusable Table Rendering */}
                  {[
                    {
                      title: "Basic Information",
                      icon: "👤",
                      color: "blue",
                      data: [
                        { label: "Name", value: selectedDetails?.name },
                        { label: "Guardian", value: selectedDetails?.guardian_name },
                        { label: "Address", value: selectedDetails?.address },
                        { label: "Mobile", value: selectedDetails?.mobile },
                        { label: "Citizenship", value: selectedDetails?.citizenship },
                        { label: "PIN Code", value: selectedDetails?.pin_code },
                        { label: "PAN", value: selectedDetails?.pan },
                        { label: "PAN Image", value: selectedDetails?.pan_image, isImage: true },
                      ]
                    },
                    {
                      title: "Work Order Details",
                      icon: "📋",
                      color: "green",
                      data: [
                        { label: "Is Within Family", value: selectedDetails?.is_within_family ? "Yes" : "No" },
                        { label: "Transfer Relationship", value: selectedDetails?.transfer_relationship },
                        { label: "Document Type", value: selectedDetails?.document_type },
                        { label: "Document Image", value: selectedDetails?.document_image, isImage: true },
                        { label: "Previous License No", value: selectedDetails?.previous_license_no },
                        { label: "License Expiry", value: selectedDetails?.license_expiry_date },
                        { label: "Property Tax Payment To Year", value: selectedDetails?.property_tax_payment_to_year },
                        { label: "Land Transfer Explanation", value: selectedDetails?.land_transfer_explanation },
                        { label: "Occupy", value: selectedDetails?.occupy ? "Yes" : "No" },
                        { label: "Occupy From Year", value: selectedDetails?.occupy_from_year },
                        { label: "Present Occupier Name", value: selectedDetails?.present_occupier_name },
                        { label: "Occupier Guardian Name", value: selectedDetails?.occupier_guardian_name },
                        { label: "Is Same Owner", value: selectedDetails?.is_same_owner ? "Yes" : "No" },
                        { label: "Rented To Whom", value: selectedDetails?.rented_to_whom },
                      ]
                    },
                    {
                      title: "Location Details",
                      icon: "📍",
                      color: "orange",
                      data: [
                        { label: "Stall No", value: selectedDetails?.stall_no },
                        { label: "Holding No", value: selectedDetails?.holding_no },
                        { label: "JL No", value: selectedDetails?.jl_no },
                        { label: "Khatian No", value: selectedDetails?.khatian_no },
                        { label: "Plot No", value: selectedDetails?.plot_no },
                        { label: "Area DOM", value: selectedDetails?.area_dom_sqft ? `${selectedDetails?.area_dom_sqft} sqft` : "" },
                        { label: "Area COM", value: selectedDetails?.area_com_sqft ? `${selectedDetails?.area_com_sqft} sqft` : "" },
                        { label: "Direction", value: selectedDetails?.direction },
                        { label: "Latitude", value: selectedDetails?.latitude },
                        { label: "Longitude", value: selectedDetails?.longitude },
                        { label: "Sketch Map Attached Image", value: selectedDetails?.sketch_map_attached, isImage: true },
                        { label: "Stall Image 1", value: selectedDetails?.stall_image1, isImage: true },
                        { label: "Stall Image 2", value: selectedDetails?.stall_image2, isImage: true },
                      ]
                    },
                    {
                      title: "Vendor Details",
                      icon: "🏢",
                      color: "purple",
                      data: [
                        { label: "Residential Certificate Attached", value: selectedDetails?.residential_certificate_attached, isImage: true },
                        { label: "Trade License Attached", value: selectedDetails?.trade_license_attached, isImage: true },
                        { label: "Affidavit Attached", value: selectedDetails?.affidavit_attached, isImage: true },
                        { label: "ADSR Name", value: selectedDetails?.adsr_name },
                        { label: "Warision Certificate Attached", value: selectedDetails?.warision_certificate_attached, isImage: true },
                        { label: "Death Certificate Attached", value: selectedDetails?.death_certificate_attached, isImage: true },
                        { label: "NOC Legal Heirs Attached", value: selectedDetails?.noc_legal_heirs_attached, isImage: true },
                      ]
                    }
                  ].map((section, idx) => (
                    <div
                      key={idx}
                      className={`bg-gradient-to-r from-${section.color}-50 to-${section.color}-100 rounded-lg p-6 border-l-4 border-${section.color}-500`}
                    >
                      <h3 className={`text-xl font-bold text-${section.color}-800 mb-4 flex items-center`}>
                        <span className="mr-2">{section.icon}</span>
                        {section.title}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                          <tbody>
                            {section.data.map((item, i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                <td className="px-4 py-2 border-b font-semibold text-gray-700 w-1/3">{item.label}</td>
                                <td className="px-4 py-2 border-b text-gray-900">
                                  {item.isImage && item.value ? (
                                    // Open image in new tab on click
                                    <img
                                      src={item.value}
                                      alt={item.label}
                                      className="w-32 h-auto rounded border cursor-pointer"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        // Open image in a new tab
                                        const newTab = window.open();
                                        if (newTab) {
                                          newTab?.document.write(`
                                          <!DOCTYPE html>
                                          <html>
                                          <head>
                                              <title>Document Viewer</title>
                                              <style>
                                                  body { margin: 0; background: #2e2e2e; display: flex; justify-content: center; align-items: center; height: 100vh; }
                                                  img { max-width: 100%; max-height: 100%; }
                                              </style>
                                          </head>
                                          <body>
                                              <img src="${item.value}" alt="Document Preview" />
                                          </body>
                                          </html>
                                        `);
                                          newTab?.document?.close();
                                        }
                                      }}
                                    />
                                  ) : (
                                    item?.value || <span className="text-gray-400">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-lg text-red-500 py-8">No data found.</p>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-2 rounded-lg text-base font-semibold shadow-md transition"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default SurveyTable;
