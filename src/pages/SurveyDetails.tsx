import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { commonApi } from '../commonAPI';
import { decodeJwtToken } from '../utils/decodeToken';

interface SurveyData {
  survey_id: number;
  survey_date: string;
  application_number: string;
  haat_id: number;
  haat_name: string;
  shop_owner_name: string;
  mobile_number: string;
  survey_status: string;
}

const ITEMS_PER_PAGE = 10;

const SurveyTable: React.FC = () => {
  const [searchParams] = useSearchParams();
  const haatStatusId = searchParams?.get("_hti");
  const title = searchParams?.get("title");
  const dashboardType = searchParams?.get("dashboardType");

  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getHaatApplicantionDetailsForAdmin = async (haatStatusId: any) => {
    const userDetails = decodeJwtToken();
    const payload = {
      "userID": userDetails?.UserID,
      "from_date": null,
      "to_date": null,
      "haatDashoardStatus": haatStatusId
    }
    const response = await commonApi(`user/getHaatApplicantionDetailsForAdmin`, payload);
    console.log(response);
    setData(response?.data || []);
    setCurrentPage(1); // Reset to first page on new data fetch
  }

  const getSurveyDetailsByShopOwnerID = async (haatStatusId: any) => {
    const userDetails = decodeJwtToken();
    const payload = {
      "userID": userDetails?.UserID,
      "from_date": null,
      "to_date": null,
      "haatDashoardStatus": haatStatusId
    }
    const response = await commonApi(`user/getSurveyDetailsByShopOwnerID?UserDashboardStatus=${haatStatusId}&ShopOwnerID=${userDetails?.UserID}`, payload);
    console.log(response);
    setData(response?.data || []);
    setCurrentPage(1); // Reset to first page on new data fetch
  }

  useEffect(()=>{
    console.log("haatStatusId", haatStatusId);
    if(haatStatusId && dashboardType == "ADMIN"){getHaatApplicantionDetailsForAdmin(haatStatusId);}
    if(haatStatusId && dashboardType == "USER"){getSurveyDetailsByShopOwnerID(haatStatusId);}
  }
    , [haatStatusId]);

  // Pagination logic
  const totalItems = data?.length;
  const totalPages = Math?.ceil(totalItems / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedData = data?.slice(startIdx, endIdx);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <button
        type="button"
        onClick={() => window?.history?.back()}
        className="mb-4 flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow transition-colors duration-150"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-tight">{title}</h1>
      <div className="overflow-x-auto rounded-2xl shadow-lg bg-gradient-to-br from-white via-gray-50 to-gray-100 p-2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {/* <th className="w-1/12 px-4 py-2">Survey ID</th> */}
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Survey Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Application Number</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Haat Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Shop Owner Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mobile Number</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData?.map((survey: any, index: number) => (
                <tr
                  key={survey.survey_id}
                  className={`transition-colors duration-200 hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  {/* <td className="px-6 py-4 text-center">{survey.survey_id}</td> */}
                  <td className="px-6 py-4 text-gray-700 text-sm">{survey?.survey_date}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{survey?.application_number}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{survey?.haat_name}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{survey?.shop_owner_name}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{survey?.mobile_number}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        survey?.survey_status === '1'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}
                    >
                      {survey?.survey_status === '1' ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 text-lg font-medium">
                  No data available for the selected criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border text-sm font-medium ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-md border text-sm font-medium ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border text-sm font-medium ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyTable;