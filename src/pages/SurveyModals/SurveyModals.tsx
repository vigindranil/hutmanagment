import React from "react";
import { Dialog } from "@headlessui/react";
import {
  X,
  CheckCircle,
  CreditCard,
  Calendar,
  MessageSquare,
  Eye,
  IndianRupee,
  User2Icon,
  MessageSquareX,
  User,
  Download,
} from "lucide-react";

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

interface PaymentModalProps {
  show: boolean;
  onClose: () => void;
  selectedSurvey: any;
  paymentName: string;
  setPaymentName: (val: string) => void;
  paymentNumber: string;
  setPaymentNumber: (val: string) => void;
  paymentEmail: string;
  setPaymentEmail: (val: string) => void;
  loading: boolean;
  loads: boolean;
  paymentSuccess: boolean;
  onSubmit: (e: React.FormEvent) => void;
  userType: number;
  haatStatusId: string | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  show,
  onClose,
  selectedSurvey,
  paymentName,
  setPaymentName,
  paymentNumber,
  setPaymentNumber,
  paymentEmail,
  setPaymentEmail,
  loading,
  loads,
  paymentSuccess,
  onSubmit,
  userType,
  haatStatusId,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform animate-in slide-in-from-bottom-4 duration-300">
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
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {loads && typeof paymentSuccess === "boolean" ? (
            paymentSuccess === true ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-slate-600">
                  Your payment has been processed successfully.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Payment Failed!
                </h3>
                <p className="text-slate-600">
                  Your payment could not be processed. Please try again.
                </p>
              </div>
            )
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Your Land Valuation is
                  </span>
                  <span className="text-2xl font-bold text-slate-900">
                    ₹{selectedSurvey?.land_valuation ?? "0"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex items-center">
                    <div className="flex flex-col flex-1 items-start text-left">
                      <span className="text-sm font-medium text-slate-700">
                        {userType == 1 && haatStatusId == "4"
                          ? selectedSurvey?.relation_status !== undefined &&
                            [1, 2, 3, 4, 5].includes(selectedSurvey.relation_status)
                            ? "The initial amount payable is calculated as 10% of 25% of the land's valuation."
                            : selectedSurvey?.relation_status === 6
                            ? "The initial amount payable is calculated as 20% of 25% of the land's valuation."
                            : ""
                          : userType == 1 && haatStatusId == "7"
                          ? selectedSurvey?.relation_status !== undefined &&
                            [1, 2, 3, 4, 5].includes(selectedSurvey.relation_status)
                            ? "The Final amount payable is calculated as 10% of 75% of the land's valuation."
                            : selectedSurvey?.relation_status === 6
                            ? "The Final amount payable is calculated as 20% of 75% of the land's valuation."
                            : ""
                          : ""}
                      </span>
                    </div>
                    <span className="ml-8 text-2xl font-bold text-slate-900 text-left">
                      ₹
                      {userType == 1 && haatStatusId == "7"
                        ? selectedSurvey?.final_amount
                        : userType == 1 && haatStatusId == "4"
                        ? selectedSurvey?.initial_amount
                        : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-slate-50 focus:bg-white"
                    placeholder="Enter your full name"
                    value={paymentName}
                    onChange={(e) => setPaymentName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-slate-50 focus:bg-white"
                    placeholder="Enter your mobile number"
                    value={paymentNumber}
                    onChange={(e) => setPaymentNumber(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-slate-50 focus:bg-white"
                    placeholder="Enter your email address"
                    value={paymentEmail}
                    onChange={(e) => setPaymentEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                  "Complete Payment"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

interface HearingModalProps {
  show: boolean;
  onClose: () => void;
  hearingDate: string;
  setHearingDate: (val: string) => void;
  selectedSurveys: number[];
  loading: boolean;
  onSubmit: () => void;
}

export const HearingModal: React.FC<HearingModalProps> = ({
  show,
  onClose,
  hearingDate,
  setHearingDate,
  selectedSurveys,
  loading,
  onSubmit,
}) => {
  console.log("render")
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Select Hearing Date
              </h2>
              <p className="text-sm text-slate-600">
                Choose a hearing date for selected surveys
              </p>
            </div>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors duration-200"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Selected Surveys
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {selectedSurveys.length}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Hearing Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-slate-50 focus:bg-white"
                value={hearingDate}
                onChange={(e) => setHearingDate(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={!hearingDate || loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  "Go"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RemarksModalProps {
  show: boolean;
  onClose: () => void;
  remarksText: string;
  setRemarksText: (val: string) => void;
  approvalAction: "approve" | "reject";
  loading: boolean;
  onSubmit: () => void;
}

export const RemarksModal: React.FC<RemarksModalProps> = ({
  show,
  onClose,
  remarksText,
  setRemarksText,
  approvalAction,
  loading,
  onSubmit,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                approvalAction === "approve"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-red-500 to-pink-600"
              }`}
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {approvalAction === "approve" ? "Approve Survey" : "Reject Survey"}
              </h2>
              <p className="text-sm text-slate-600">
                Please provide remarks (minimum 10 characters)
              </p>
            </div>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors duration-200"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div
              className={`rounded-xl p-4 border ${
                approvalAction === "approve"
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-100"
                  : "bg-gradient-to-r from-red-50 to-pink-50 border-red-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Action</span>
                <span
                  className={`text-xl font-bold ${
                    approvalAction === "approve" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {approvalAction === "approve" ? "APPROVE" : "REJECT"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Remarks <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-slate-50 focus:bg-white resize-none"
                placeholder="Enter your remarks here (minimum 10 characters)..."
                value={remarksText}
                onChange={(e) => setRemarksText(e.target.value)}
                rows={4}
                required
              />
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs ${
                    remarksText.length >= 10 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {remarksText.length >= 10
                    ? "✓ Valid length"
                    : `${10 - remarksText.length} characters needed`}
                </span>
                <span className="text-xs text-slate-500">
                  {remarksText.length}/500 characters
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={remarksText.length < 10 || loading}
                className={`flex-1 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl ${
                  approvalAction === "approve"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500"
                    : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-slate-400 disabled:to-slate-500"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  "OK"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ViewDetailsModalProps {
  show: boolean;
  onClose: () => void;
  isLoading: boolean;
  selectedDetails: FullApplicationDetails | null;
}

export const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({
  show,
  onClose,
  isLoading,
  selectedDetails,
}) => {
  if (!show) return null;

  return (
    <Dialog open={show} onClose={onClose} className="relative z-[9999]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-8">
        <Dialog.Panel className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-8 shadow-2xl overflow-y-auto max-h-[95vh] border-2 border-blue-400">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-extrabold text-blue-700 tracking-wide">
              Application Details
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <div className="text-blue-700 font-semibold text-lg">Loading details...</div>
            </div>
          ) : selectedDetails ? (
            <div className="space-y-8">
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
                    { label: "Land Valuation", value: `₹ ${selectedDetails?.land_valuation_amount}` },
                    {
                      label: "Initial Payment Amount",
                      value: selectedDetails?.initial_amount != null ? (
                        <span>
                          ₹ {selectedDetails.initial_amount}
                          {selectedDetails.initial_payment_status == 1 && (
                            <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold">
                              Completed
                            </span>
                          )}
                          {selectedDetails.initial_payment_status == 0 && (
                            <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">
                              Pending
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="font-bold text-red-600">Pending</span>
                      ),
                    },
                    {
                      label: "Final Payment Amount",
                      value: selectedDetails?.final_amount != null ? (
                        <span>
                          ₹ {selectedDetails.final_amount}
                          {selectedDetails.final_payment_status == 1 && (
                            <span className="ml-2 px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold">
                              Completed
                            </span>
                          )}
                          {selectedDetails.final_payment_status == 0 && (
                            <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">
                              Pending
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="font-bold text-red-600">Pending</span>
                      ),
                    },
                  ],
                },
                {
                  title: "Documents Details",
                  icon: "📋",
                  color: "green",
                  data: [
                    {
                      label: "Is Within Family",
                      value: selectedDetails?.is_within_family ? "Yes" : "No",
                    },
                    {
                      label: "Transfer Relationship",
                      value:
                        selectedDetails?.transfer_relationship == "1"
                          ? "Wife"
                          : selectedDetails?.transfer_relationship == "2"
                          ? "Daughter"
                          : selectedDetails?.transfer_relationship == "3"
                          ? "Son"
                          : selectedDetails?.transfer_relationship == "4"
                          ? "Father"
                          : selectedDetails?.transfer_relationship == "5"
                          ? "Mother"
                          : selectedDetails?.transfer_relationship == "6"
                          ? "Other"
                          : selectedDetails?.transfer_relationship || "",
                    },
                    {
                      label: "Document Type",
                      value:
                        selectedDetails?.document_type == "1"
                          ? "Aadhar"
                          : selectedDetails?.document_type == "2"
                          ? "Voter"
                          : selectedDetails?.document_type || "",
                    },
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
                  ],
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
                  ],
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
                  ],
                },
                {
                  title: "Hearing Details",
                  icon: "📅",
                  color: "orange",
                  data: [
                    { label: "Hearing Date", value: selectedDetails?.hearing_date, isDate: true },
                    { label: "Hearing Approved Date", value: selectedDetails?.hearing_approved_date, isDate: true },
                    { label: "Hearing Remarks", value: selectedDetails?.hearing_remarks },
                    { label: "Hearing Approved By", value: selectedDetails?.hearing_approved_by },
                  ],
                },
                {
                  title: "Approval Officer Remark",
                  icon: "👤",
                  color: "green",
                  data: [
                    { label: "Final Approval Date", value: selectedDetails?.approval_date, isDate: true },
                    { label: "Final Approval Remarks", value: selectedDetails?.approval_remarks },
                    { label: "Lisence Approved By", value: selectedDetails?.survey_approved_by },
                  ],
                },
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
                            <td className="px-4 py-2 border-b font-semibold text-gray-700 w-1/3">
                              {item.label}
                            </td>
                            <td className="px-4 py-2 border-b text-gray-900">
                              {"isImage" in item && item.isImage && item.value ? (
                                <img
                                  src={item.value as string}
                                  alt={item.label}
                                  className="w-32 h-auto rounded border cursor-pointer"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    const newTab = window.open();
                                    if (newTab) {
                                      newTab.document.write(`
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
                                      newTab.document.close();
                                    }
                                  }}
                                />
                              ) : (
                                item?.value ?? <span className="text-gray-400">-</span>
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
              onClick={onClose}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-2 rounded-lg text-base font-semibold shadow-md transition"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

interface PdfPreviewModalProps {
  show: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  pdfFilename: string;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  show,
  onClose,
  pdfUrl,
  pdfFilename,
}) => {
  if (!show) return null;

  return (
    <Dialog open={show} onClose={onClose} className="relative z-[9999]">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-0 sm:p-4">
        <Dialog.Panel className="mx-auto flex flex-col w-full max-w-full sm:max-w-4xl h-screen sm:h-[90vh] rounded-none sm:rounded-2xl bg-gray-100 shadow-2xl max-h-screen sm:max-h-[90vh]">
          <div className="flex-shrink-0 flex items-center justify-between p-2 sm:p-4 border-b bg-white/80 backdrop-blur-sm rounded-none sm:rounded-t-2xl">
            <Dialog.Title className="text-base sm:text-xl font-bold text-gray-800">
              Certificate Preview
            </Dialog.Title>
            <div className="flex items-center gap-2 sm:gap-4">
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  download={pdfFilename}
                  className="inline-flex items-center px-2 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-all duration-200 text-xs sm:text-base"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-600 focus:outline-none transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-grow p-0 sm:p-2 bg-gray-200 overflow-auto">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="Certificate Preview"
                className="w-full h-[calc(100vh-56px)] sm:h-full border-0 sm:border-2 border-gray-300 rounded-none sm:rounded-lg"
                style={{
                  minHeight: "60vh",
                  height: "calc(100vh - 56px)",
                  maxHeight: "100vh",
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-base sm:text-lg font-semibold text-gray-600">
                  Loading PDF preview...
                </div>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};