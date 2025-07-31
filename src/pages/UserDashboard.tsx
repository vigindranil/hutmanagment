"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { BASE_API_URL } from "../constants";
import Cookies from 'js-cookie';

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

const UserDashboard: React.FC = () => {
  const [applicationData, setApplicationData] = useState<HaatApplicationDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<FullApplicationDetails | null>(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("Authorization", "Basic ODAwMTEwNDM3Njo5OTk5");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({ user_id: 13 });

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
        const data = Array.isArray(result?.data) ? result.data : [result.data];
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

  const handleViewClick = async (surveyId: string) => {
    try {
      const token = Cookies.get('token'); // get fresh token
  
      const myHeaders = new Headers();
      myHeaders.append("accept", "*/*");
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");
  
      const raw = JSON.stringify({ surveyID: parseInt(surveyId) });
  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect,
      };
  
      const response = await fetch(
        BASE_API_URL + "user/getHaatApplicationDetailsBySurveyID",
        requestOptions
      );
      
  
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
  
      const result = await response.json();
      setSelectedDetails(result?.data || null);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching full details:", error);
      alert("Failed to fetch application details. Make sure your credentials/token are valid.");
    }
  };

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
          <p>Loading...</p>
        ) : applicationData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">Survey Date</th>
                  <th className="px-4 py-2 border">Application Number</th>
                  <th className="px-4 py-2 border">Haat Name</th>
                  <th className="px-4 py-2 border">Shop Owner Name</th>
                  <th className="px-4 py-2 border">Mobile</th>
                  <th className="px-4 py-2 border">District</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicationData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2 border text-sm">{row?.survey_date}</td>
                    <td className="px-4 py-2 border text-sm">{row?.application_number}</td>
                    <td className="px-4 py-2 border text-sm">{row?.haat_name}</td>
                    <td className="px-4 py-2 border text-sm">{row?.shop_owner_name}</td>
                    <td className="px-4 py-2 border text-sm">{row?.mobile_number}</td>
                    <td className="px-4 py-2 border text-sm">{row?.district_name}</td>
                    <td className="px-4 py-2 border text-sm flex gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                        onClick={() => handleViewClick(row.survey_id)}
                      >
                        View
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-red-500">No application data found.</p>
        )}
      </div>

      {/* MODAL */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-8">
          <Dialog.Panel className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-8 shadow-2xl overflow-y-auto max-h-[95vh] border-2 border-blue-400">
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
            {selectedDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[5px] gap-y-[2px] text-base">
                <div>
                  {/* <p><span className="font-semibold text-gray-700">Survey ID:</span> {selectedDetails?.survey_id}</p> */}
                  {/* <p><span className="font-semibold text-gray-700">License Type:</span> {selectedDetails?.license_type}</p> */}
                  {/* <p><span className="font-semibold text-gray-700">Application Status:</span> {selectedDetails?.application_status}</p> */}
                  {/* <p><span className="font-semibold text-gray-700">Applicant Type:</span> {selectedDetails?.applicant_type}</p> */}
                  {/* <p><span className="font-semibold text-gray-700">Usage Type:</span> {selectedDetails?.usage_type}</p> */}
                  <p><span className="font-semibold text-gray-700">Name:</span> {selectedDetails?.name}</p>
                  <p><span className="font-semibold text-gray-700">Guardian:</span> {selectedDetails?.guardian_name}</p>
                  <p><span className="font-semibold text-gray-700">Address:</span> {selectedDetails?.address}</p>
                  <p><span className="font-semibold text-gray-700">Mobile:</span> {selectedDetails?.mobile}</p>
                  <p><span className="font-semibold text-gray-700">Citizenship:</span> {selectedDetails?.citizenship}</p>
                  <p><span className="font-semibold text-gray-700">PIN Code:</span> {selectedDetails?.pin_code}</p>
                  <p><span className="font-semibold text-gray-700">Is Within Family:</span> {selectedDetails?.is_within_family ? "Yes" : "No"}</p>
                  <p><span className="font-semibold text-gray-700">Transfer Relationship:</span> {selectedDetails?.transfer_relationship}</p>
                  <p><span className="font-semibold text-gray-700">Document Type:</span> {selectedDetails?.document_type}</p>
                  <p><span className="font-semibold text-gray-700">Document Image:</span> {selectedDetails?.document_image}</p>
                  <p><span className="font-semibold text-gray-700">PAN:</span> {selectedDetails?.pan}</p>
                  <p><span className="font-semibold text-gray-700">PAN Image:</span> {selectedDetails?.pan_image}</p>
                  <p><span className="font-semibold text-gray-700">Previous License No:</span> {selectedDetails?.previous_license_no}</p>
                  <p><span className="font-semibold text-gray-700">License Expiry:</span> {selectedDetails?.license_expiry_date}</p>
                  <p><span className="font-semibold text-gray-700">Property Tax Payment To Year:</span> {selectedDetails?.property_tax_payment_to_year}</p>
                  <p><span className="font-semibold text-gray-700">Land Transfer Explanation:</span> {selectedDetails?.land_transfer_explanation}</p>
                  <p><span className="font-semibold text-gray-700">Occupy:</span> {selectedDetails?.occupy ? "Yes" : "No"}</p>
                  <p><span className="font-semibold text-gray-700">Occupy From Year:</span> {selectedDetails?.occupy_from_year}</p>
                  <p><span className="font-semibold text-gray-700">Present Occupier Name:</span> {selectedDetails?.present_occupier_name}</p>
                  <p><span className="font-semibold text-gray-700">Occupier Guardian Name:</span> {selectedDetails?.occupier_guardian_name}</p>
                  <p><span className="font-semibold text-gray-700">Residential Certificate Attached:</span> {selectedDetails?.residential_certificate_attached}</p>
                </div>
                <div>
                  
                  <p><span className="font-semibold text-gray-700">Trade License Attached:</span> {selectedDetails?.trade_license_attached}</p>
                  <p><span className="font-semibold text-gray-700">Affidavit Attached:</span> {selectedDetails?.affidavit_attached}</p>
                  <p><span className="font-semibold text-gray-700">ADSR Name:</span> {selectedDetails?.adsr_name}</p>
                  <p><span className="font-semibold text-gray-700">Warision Certificate Attached:</span> {selectedDetails?.warision_certificate_attached}</p>
                  <p><span className="font-semibold text-gray-700">Death Certificate Attached:</span> {selectedDetails?.death_certificate_attached}</p>
                  <p><span className="font-semibold text-gray-700">NOC Legal Heirs Attached:</span> {selectedDetails?.noc_legal_heirs_attached}</p>
                  <p><span className="font-semibold text-gray-700">Is Same Owner:</span> {selectedDetails?.is_same_owner ? "Yes" : "No"}</p>
                  <p><span className="font-semibold text-gray-700">Rented To Whom:</span> {selectedDetails?.rented_to_whom}</p>
                  {/* <p><span className="font-semibold text-gray-700">District ID:</span> {selectedDetails?.district_id}</p> */}
                  {/* <p><span className="font-semibold text-gray-700">Police Station ID:</span> {selectedDetails?.police_station_id}</p> */}
                  {/* <p><span className="font-semibold text-gray-700">Hat ID:</span> {selectedDetails?.hat_id}</p> */}
                  {/* <p><span className="font-semibold text-gray-700">Mouza ID:</span> {selectedDetails?.mouza_id}</p> */}
                  <p><span className="font-semibold text-gray-700">Stall No:</span> {selectedDetails?.stall_no}</p>
                  <p><span className="font-semibold text-gray-700">Holding No:</span> {selectedDetails?.holding_no}</p>
                  <p><span className="font-semibold text-gray-700">JL No:</span> {selectedDetails?.jl_no}</p>
                  <p><span className="font-semibold text-gray-700">Khatian No:</span> {selectedDetails?.khatian_no}</p>
                  <p><span className="font-semibold text-gray-700">Plot No:</span> {selectedDetails?.plot_no}</p>
                  <p><span className="font-semibold text-gray-700">Area DOM:</span> {selectedDetails?.area_dom_sqft} sqft</p>
                  <p><span className="font-semibold text-gray-700">Area COM:</span> {selectedDetails?.area_com_sqft} sqft</p>
                  <p><span className="font-semibold text-gray-700">Direction:</span> {selectedDetails?.direction}</p>
                  <p><span className="font-semibold text-gray-700">Latitude:</span> {selectedDetails?.latitude}</p>
                  <p><span className="font-semibold text-gray-700">Longitude:</span> {selectedDetails?.longitude}</p>
                  <p><span className="font-semibold text-gray-700">Sketch Map Attached:</span> {selectedDetails?.sketch_map_attached}</p>
                  <p><span className="font-semibold text-gray-700">Stall Image 1:</span> {selectedDetails?.stall_image1}</p>
                  <p><span className="font-semibold text-gray-700">Stall Image 2:</span> {selectedDetails?.stall_image2}</p>
                  {/* <p><span className="font-semibold text-gray-700">User ID:</span> {selectedDetails?.user_id}</p> */}
                </div>
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
  );
};

export default UserDashboard;
