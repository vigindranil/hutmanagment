"use client";
import React, { useEffect, useState } from "react";
import { BASE_API_URL } from "../constants";

interface HaatApplicationDetails {
  survey_id: string;
  survey_date: string;
  application_number: string;
  haat_id: string;
  haat_name: string;
  shop_owner_name: string;
  mobile_number: string;
  survey_status: string;
  license_type: string;
  district_id: string;
  district_name: string;
}

const UserDashboard: React.FC = () => {
  const [applicationData, setApplicationData] = useState<HaatApplicationDetails[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("Authorization", "Basic ODAwMTEwNDM3Njo5OTk5");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          user_id: 13,
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow" as RequestRedirect,
        };

        const response = await fetch(
          BASE_API_URL + "user/getHaatApplicationDetailsByUserID",
          requestOptions
        );

        const result = await response.json();
        // Ensure data is always an array for table rendering
        let data = result?.data;
        if (data && !Array.isArray(data)) data = [data];
        setApplicationData(data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setApplicationData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicationDetails();
  }, []);

  return (
    <div className="pt-8 pl-8 pr-8">
      <div className="p-8 bg-white/80 rounded-2xl shadow-xl border border-white/20">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          My Application
        </h1>
        <p className="text-gray-600 font-medium mb-6">
          Welcome to your application dashboard.
        </p>
        {loading ? (
          <p className="text-gray-500">Loading application details...</p>
        ) : applicationData && applicationData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 border">Survey ID</th>
                  <th className="px-4 py-2 border">Survey Date</th>
                  <th className="px-4 py-2 border">Application Number</th>
                  <th className="px-4 py-2 border">Haat ID</th>
                  <th className="px-4 py-2 border">Haat Name</th>
                  <th className="px-4 py-2 border">Shop Owner Name</th>
                  <th className="px-4 py-2 border">Mobile Number</th>
                  <th className="px-4 py-2 border">Survey Status</th>
                  <th className="px-4 py-2 border">License Type</th>
                  <th className="px-4 py-2 border">District ID</th>
                  <th className="px-4 py-2 border">District Name</th>
                </tr>
              </thead>
              <tbody>
                {applicationData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2 border">{row.survey_id || "0"}</td>
                    <td className="px-4 py-2 border">{row.survey_date}</td>
                    <td className="px-4 py-2 border">{row.application_number}</td>
                    <td className="px-4 py-2 border">{row.haat_id}</td>
                    <td className="px-4 py-2 border">{row.haat_name}</td>
                    <td className="px-4 py-2 border">{row.shop_owner_name}</td>
                    <td className="px-4 py-2 border">{row.mobile_number}</td>
                    <td className="px-4 py-2 border">{row.survey_status}</td>
                    <td className="px-4 py-2 border">{row.license_type}</td>
                    <td className="px-4 py-2 border">{row.district_id}</td>
                    <td className="px-4 py-2 border">{row.district_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-red-500">No application data found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
