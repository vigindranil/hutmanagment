"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { BASE_API_URL } from "../constants";

interface SurveyReport {
  // survey_id: string;
  application_number: string;
  haat_id: string;
  haat_name: string;
  shop_owner_name: string;
  mobile_number: string;
  survey_status: string;
  license_type: string;
  survey_date: string;
}

const Reports: React.FC = () => {
  const [surveyData, setSurveyData] = useState<SurveyReport[]>([]);

  useEffect(() => {
    const fetchSurveyData = async () => {
      const token = Cookies.get("token");

      const myHeaders = new Headers();
      myHeaders.append("accept", "*/*");
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        from_date: "01-01-2024",
        to_date: "30-07-2025",
        application_status_id: 1,
        user_id: 7
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect
      };

      try {
        const response = await fetch( BASE_API_URL + "user/getSurveyDetailsReport",requestOptions);
        const result = await response.json();
        console.log("Survey Report API Result:", result);

        if (result?.status === 0 && Array.isArray(result?.data)) {
          setSurveyData(result.data);
        } else {
          console.error("API Error:", result?.message || "Unexpected API response");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchSurveyData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Survey Reports</h1>
        <p className="mt-1 text-gray-500">Survey details table</p>
        <form className="flex flex-col sm:flex-row sm:items-end gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="applicationStatus">
              Application Status
            </label>
            <select
              id="applicationStatus"
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              // value={} onChange={}
            >
              <option value={1}>New</option>
              <option value={2}>Existing</option>
              <option value={3}>Transfer</option>
              <option value={4}>Rent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fromDate">
              From Date
            </label>
            <input
              type="date"
              id="fromDate"
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              // value={} onChange={}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="toDate">
              To Date
            </label>
            <input
              type="date"
              id="toDate"
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              // value={} onChange={}
            />
          </div>
        </form>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              {/* <th className="px-4 py-2 border">Survey ID</th> */}
              <th className="px-4 py-2 border">Survey Date</th>
              <th className="px-4 py-2 border">Application Number</th>
              <th className="px-4 py-2 border">Haat ID</th>
              <th className="px-4 py-2 border">Haat Name</th>
              <th className="px-4 py-2 border">Shop Owner Name</th>
              <th className="px-4 py-2 border">Mobile Number</th>
              <th className="px-4 py-2 border">Survey Status</th>
              <th className="px-4 py-2 border">License Type</th>
            </tr>
          </thead>
          <tbody>
            {surveyData.length > 0 ? (
              surveyData.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {/* <td className="px-4 py-2 border">{row.survey_id}</td> */}
                  <td className="px-4 py-2 border">{row.survey_date}</td>
                  <td className="px-4 py-2 border">{row.application_number}</td>
                  <td className="px-4 py-2 border">{row.haat_id}</td>
                  <td className="px-4 py-2 border">{row.haat_name}</td>
                  <td className="px-4 py-2 border">{row.shop_owner_name}</td>
                  <td className="px-4 py-2 border">{row.mobile_number}</td>
                  <td className="px-4 py-2 border">{row.survey_status}</td>
                  <td className="px-4 py-2 border">{row.license_type}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center px-4 py-4 text-gray-500">
                  No survey data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
