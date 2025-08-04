"use client";
import React, { useEffect, useState } from "react";
import { decodeJwtToken } from "../utils/decodeToken";
import { commonApi } from "../commonAPI";
import moment from "moment";
import { BASE_API_URL } from "../constants";
import Cookies from "js-cookie";
import { Dialog } from "@headlessui/react";

interface SurveyReport {
  survey_id: string;
  application_number: string;
  haat_id: string;
  haat_name: string;
  shop_owner_name: string;
  mobile_number: string;
  survey_status: string;
  license_type: string;
  survey_date: string;
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

const Reports: React.FC = () => {
  const [surveyData, setSurveyData] = useState<SurveyReport[]>([]);
  const [applicationStatus, setApplicationStatus] = useState<any>(1);
  const [fromDate, setFromDate] = useState<any>(null);
  const [toDate, setToDate] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<FullApplicationDetails | null>(null);

  const handleSearch = () => {fetchSurveyData();};

  const handleViewClick = async (surveyId: string) => {
    try {
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

      const response = await fetch(BASE_API_URL + "user/getHaatApplicationDetailsBySurveyID",requestOptions);


      if (!response.ok) {
        throw new Error(`HTTP ${response?.status}: ${await response?.text()}`);
      }

      const result = await response.json();
      setSelectedDetails(result?.data || null);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching full details:", error);
      alert("Failed to fetch application details. Make sure your credentials/token are valid.");
    }
  };


  const fetchSurveyData = async () => {

    try {
      const userDetails = decodeJwtToken();
      const body = {
        from_date: fromDate ? moment(fromDate).format("DD-MM-YYYY") : null,
        to_date: toDate ? moment(toDate).format("DD-MM-YYYY") : null,
        application_status_id: parseInt(applicationStatus),
        user_id: userDetails?.UserID
      }
      const result = await commonApi(`user/getSurveyDetailsReport`, body);

      console.log("Survey Report API Result:", result);

      if (result?.status === 0 && Array?.isArray(result?.data)) {
        setSurveyData(result.data);
      } else {
        setSurveyData([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {fetchSurveyData();}, []);

  const surveyStatusMap: { [key: number]: string } = {
    1: "New",
    2: "Existing", 
    3: "Transfer",
    4: "Rent",
  };

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
              value={applicationStatus}
              onChange={e => setApplicationStatus(e?.target?.value)}
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
              value={fromDate}
              onChange={(e) => setFromDate(e?.target?.value)}
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
              value={toDate}
              onChange={(e) => setToDate(e?.target?.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow transition-colors duration-150"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              {/* <th className="px-4 py-2 border">Survey ID</th> */}
              <th className="px-4 py-2 border">Application Number</th>
              <th className="px-4 py-2 border">Shop Owner Name</th>
              <th className="px-4 py-2 border">Mobile Number</th>
              <th className="px-4 py-2 border">Haat Name</th>
              <th className="px-4 py-2 border">Survey Date</th>
              {/* <th className="px-4 py-2 border">Haat ID</th> */}
              <th className="px-4 py-2 border">Survey Status</th>
              {/* <th className="px-4 py-2 border">License Type</th> */}
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {surveyData.length > 0 ? (
              surveyData.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {/* <td className="px-4 py-2 border">{row.survey_id}</td> */}
                  <td className="px-4 py-2 border">{row?.application_number}</td>
                  <td className="px-4 py-2 border">{row?.shop_owner_name}</td>
                  <td className="px-4 py-2 border">{row?.mobile_number}</td>
                  <td className="px-4 py-2 border">{row?.haat_name}</td>
                  <td className="px-4 py-2 border">{row?.survey_date}</td>
                  {/* <td className="px-4 py-2 border">{row?.haat_id}</td> */}
                  <td className="px-4 py-2 border">{surveyStatusMap[parseInt(row?.survey_status)] || "Unknown"}</td>
                  {/* <td className="px-4 py-2 border">{row?.license_type}</td> */}
                  <td className="px-4 py-2 border">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleViewClick(row.survey_id)}
                    >
                      View
                    </button>
                  </td>
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
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                  <tbody>
                    {[
                      { label: "Name", value: selectedDetails?.name },
                      { label: "Guardian", value: selectedDetails?.guardian_name },
                      { label: "Address", value: selectedDetails?.address },
                      { label: "Mobile", value: selectedDetails?.mobile },
                      { label: "Citizenship", value: selectedDetails?.citizenship },
                      { label: "PIN Code", value: selectedDetails?.pin_code },
                      { label: "Is Within Family", value: selectedDetails?.is_within_family ? "Yes" : "No" },
                      { label: "Transfer Relationship", value: selectedDetails?.transfer_relationship },
                      { label: "Document Type", value: selectedDetails?.document_type },
                      { label: "Document Image", value: selectedDetails?.document_image },
                      { label: "PAN", value: selectedDetails?.pan },
                      { label: "PAN Image", value: selectedDetails?.pan_image },
                      { label: "Previous License No", value: selectedDetails?.previous_license_no },
                      { label: "License Expiry", value: selectedDetails?.license_expiry_date },
                      { label: "Property Tax Payment To Year", value: selectedDetails?.property_tax_payment_to_year },
                      { label: "Land Transfer Explanation", value: selectedDetails?.land_transfer_explanation },
                      { label: "Occupy", value: selectedDetails?.occupy ? "Yes" : "No" },
                      { label: "Occupy From Year", value: selectedDetails?.occupy_from_year },
                      { label: "Present Occupier Name", value: selectedDetails?.present_occupier_name },
                      { label: "Occupier Guardian Name", value: selectedDetails?.occupier_guardian_name },
                      { label: "Residential Certificate Attached", value: selectedDetails?.residential_certificate_attached },
                      { label: "Trade License Attached", value: selectedDetails?.trade_license_attached },
                      { label: "Affidavit Attached", value: selectedDetails?.affidavit_attached },
                      { label: "ADSR Name", value: selectedDetails?.adsr_name },
                      { label: "Warision Certificate Attached", value: selectedDetails?.warision_certificate_attached },
                      { label: "Death Certificate Attached", value: selectedDetails?.death_certificate_attached },
                      { label: "NOC Legal Heirs Attached", value: selectedDetails?.noc_legal_heirs_attached },
                      { label: "Is Same Owner", value: selectedDetails?.is_same_owner ? "Yes" : "No" },
                      { label: "Rented To Whom", value: selectedDetails?.rented_to_whom },
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
                      { label: "Sketch Map Attached", value: selectedDetails?.sketch_map_attached },
                      { label: "Stall Image 1", value: selectedDetails?.stall_image1 },
                      { label: "Stall Image 2", value: selectedDetails?.stall_image2 },
                    ].map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-4 py-2 border-b font-semibold text-gray-700 w-1/3">{item.label}</td>
                        <td className="px-4 py-2 border-b text-gray-900">
                          {item.label.toLowerCase().includes("image") && item.value ? (
                            <a href={String(item.value)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                          ) : (
                            item.value || <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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


export default Reports;
