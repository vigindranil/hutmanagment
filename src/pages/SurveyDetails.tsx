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

const SurveyTable: React.FC = () => {
  const [searchParams] = useSearchParams();
  const haatStatusId = searchParams?.get("_hti");
  const title = searchParams?.get("title");
  const [data, setData] = useState<any>([]);

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
  }

  useEffect(()=>{
    console.log("haatStatusId", haatStatusId);
    
    if(haatStatusId){
      getHaatApplicantionDetailsForAdmin(haatStatusId);
    }
  }, [haatStatusId])

  return (
    <div className="container mx-auto p-4">
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
            {data && data.length > 0 ? (
              data.map((survey: any, index: number) => (
                <tr
                  key={survey.survey_id}
                  className={`transition-colors duration-200 hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  {/* <td className="px-6 py-4 text-center">{survey.survey_id}</td> */}
                  <td className="px-6 py-4 text-gray-700 text-sm">{survey.survey_date}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{survey.application_number}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{survey.haat_name}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{survey.shop_owner_name}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{survey.mobile_number}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        survey.survey_status === '1'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}
                    >
                      {survey.survey_status === '1' ? 'Completed' : 'Pending'}
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
      </div>
    </div>
  );
};

export default SurveyTable;