"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { commonApi } from '../commonAPI';
import { decodeJwtToken } from '../utils/decodeToken';
import { ChevronLeft, ChevronRight, CreditCard, X, CheckCircle, Calendar, Building, User, Phone, IndianRupee } from 'lucide-react';

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
}

const ITEMS_PER_PAGE = 10;

const SurveyTable: React.FC = () => {
  const [searchParams] = useSearchParams();
  const haatStatusId = searchParams?.get("_hti");
  const title = searchParams?.get("title");
  const dashboardType = searchParams?.get("dashboardType");
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyData | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentName, setPaymentName] = useState('');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [paymentEmail, setPaymentEmail] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(1);

  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

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
      initial_or_final_payment_status: selectedSurvey?.survey_status === 'FINAL' ? 2 : 1,
      survey_id: selectedSurvey?.survey_id,
      transaction_number: Math.floor(1000 + Math.random() * 9000).toString(),
      amount: selectedSurvey?.amount ?? 0,
      user_id: userDetails?.UserID,
      error_code: 0,
    };
    await commonApi(`user/savePaymentDetailsBySurveyID`, payload);
    setLoading(false);
  };

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
  }, [haatStatusId]);

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
    setPaymentSuccess(true);
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentSuccess(false);
      setPaymentName('');
      setPaymentNumber('');
      setPaymentEmail('');
    }, 2000);
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setPaymentSuccess(false);
    setPaymentName('');
    setPaymentNumber('');
    setPaymentEmail('');
  };

  return (
    <div className="min-h-screen">
      <div className="min-h-full fixed z-[0] w-full bg-[url('https://img.freepik.com/free-vector/ecommerce-web-store-hand-drawn-illustration_107791-10966.jpg')] bg-cover bg-center bg-no-repeat opacity-15"></div>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData && paginatedData.length > 0 ? (
                  paginatedData.map((survey: any, index: number) => (
                    <tr
                      key={survey.survey_id}
                      className="group hover:bg-blue-50/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {survey?.application_number}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-slate-900 font-medium">{survey?.survey_date}</span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-slate-900 font-medium">{survey?.haat_name}</span>
                      </td>

                      {(userType == 50) ? <td className="px-6 py-4"><span className="text-slate-900">{survey?.shopowner_name}</span></td> : <td className="px-6 py-4"><span className="text-slate-900">{survey?.shop_owner_name}</span></td>}
                      
                      <td className="px-6 py-4">
                        <span className="text-slate-600">{survey?.mobile_number}</span>
                      </td>

                      {userType == 50 && (
                        <>
                          <td className="px-6 py-4">
                            <span className="text-slate-900 font-medium">{survey?.payment_date}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-900 font-medium">{survey?.amount}</span>
                          </td>
                        </>
                      )}

                      {(haatStatusId == "4" && userType == 1) && (
                        <>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-800">
                              ₹{survey?.amount}
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={Number(haatStatusId) === 4 ? 7 : 5}
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
                    <p className="text-sm text-slate-600">Complete your payment securely</p>
                  </div>
                </div>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  onClick={closeModal}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {paymentSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Payment Successful!</h3>
                    <p className="text-slate-600">Your payment has been processed successfully.</p>
                  </div>
                ) : (
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {/* Amount Display */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Amount to Pay</span>
                        <span className="text-2xl font-bold text-slate-900">₹{selectedSurvey?.amount}</span>
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
      </div>
    </div>
  );
};

export default SurveyTable;