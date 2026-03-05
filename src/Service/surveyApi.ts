import Cookies from "js-cookie";
import { decodeJwtToken } from "../utils/decodeToken";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

// ==========================================
// From commonAPI.ts
// ==========================================

export const commonApi = async (url: string, body: any = {}, type = "POST") => {
  const myHeaders = new Headers();
  myHeaders.append("accept", "*/*");
  myHeaders.append("Content-Type", "application/json");
  const token = Cookies.get("token");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions =
    type == "POST"
      ? {
        method: type,
        headers: myHeaders,
        body: JSON.stringify(body),
      }
      : {
        method: type,
        headers: myHeaders,
      };
  const result = await fetch(BASE_API_URL + url, requestOptions);
  return await result.json();
};

export const getIdentityDocument = async (documentPath: string) => {
  const token = Cookies.get("token");
  const url = `${BASE_API_URL}/getImgAsBase64ByFileName/${documentPath}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const commonApiImage = async (file_url: string) => {
  if (!file_url) return null;
  const myHeaders = new Headers();
  myHeaders.append("accept", "*/*");
  myHeaders.append("Content-Type", "application/json");

  const token = Cookies.get("token");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };
  console.log("file_url", file_url);
  const res = await fetch(
    BASE_API_URL + "user/getImgAsBase64ByFileName/" + file_url,
    requestOptions
  );

  const response = await res.json(); // adjust based on API response

  console.log("response", response);
  const base64 = response?.data;
  if (!base64) throw new Error("No base64 data returned from API");

  // Detect and strip data URI prefix if present
  const cleanedBase64 = base64.includes(",")
    ? base64.split(",")[1]
    : base64;

  // Remove whitespace/newlines just in case
  const normalizedBase64 = cleanedBase64.replace(/\s/g, "");

  // Convert base64 → Blob → Object URL
  const byteString = atob(normalizedBase64);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  // Guess MIME type from prefix or default to PNG
  const mimeType = base64.includes("image/jpeg")
    ? "image/jpeg"
    : base64.includes("image/png")
      ? "image/png"
      : "application/octet-stream";

  const blob = new Blob([uint8Array], { type: mimeType });
  return URL.createObjectURL(blob);
};

// ==========================================
// Interfaces
// ==========================================

export interface SaveHearingDatePayload {
  lstSurveyId: number[];
  entry_user_id: number;
  hearing_date: string;
}

export interface UpdateApprovalStatusPayload {
  survey_id: number;
  entry_user_id: number;
  remarks: string;
  approval_status: 1 | 2; // 1 for approve, 2 for reject
}

export interface SaveFinalApprovalPayload {
  survey_id: number;
  final_approval_status: 1 | 2;
  remarks: string;
  approval_officer_id: number;
}

export interface SavePaymentDetailsPayload {
  initial_or_final_payment_status: 1 | 2 | undefined;
  survey_id: number | undefined;
  amount: number;
  user_id: number | undefined;
}

export type MakerUploadFiles = {
  documentImage?: File | Blob;
  panImage?: File | Blob;
  residentialCertificateAttached?: File | Blob;
  tradeLicenseAttached?: File | Blob;
  affidavitAttached?: File | Blob;
  warisionCertificateAttached?: File | Blob;
  deathCertificateAttached?: File | Blob;
  nocLegalHeirsAttached?: File | Blob;
  landValuationDoc?: File | Blob;
  sketchMapAttached?: File | Blob;
  stallImage1?: File | Blob;
  stallImage2?: File | Blob;
};

// ==========================================
// From pages/surveyAPI/surveyAPI.ts
// ==========================================

export const getHaatApplicantionDetailsForAdmin = async (haatStatusId: any) => {
  const userDetails = decodeJwtToken();
  const payload = {
    userID: userDetails?.UserID,
    from_date: null,
    to_date: null,
    haatDashoardStatus: haatStatusId,
  };
  const response = await commonApi(
    `user/getHaatApplicantionDetailsForAdmin`,
    payload
  );
  return response?.data || [];
};

export const getCheckerDashboardDetails = async (haatStatusId: any) => {
  const userDetails = decodeJwtToken();
  const response = await commonApi(
    `user/getCheckerDashboardDetails?CheckerDashboardStatus=${haatStatusId}&UserID=${userDetails?.UserID}`
  );
  return response?.data || [];
};

export const savePaymentDetailsBySurveyID = async (
  selectedSurvey: any,
  userDetails: any
) => {
  const payload = {
    initial_or_final_payment_status:
      selectedSurvey?.survey_status === "1"
        ? 1
        : selectedSurvey?.survey_status === "5"
          ? 2
          : undefined,
    survey_id: selectedSurvey?.survey_id,
    amount:
      (selectedSurvey?.survey_status === "1"
        ? selectedSurvey?.initial_amount
        : selectedSurvey?.final_amount) || 0,
    user_id: userDetails?.UserID,
  };

  const response = await commonApi(
    `user/savePaymentDetailsBySurveyID`,
    payload
  );
  return response;
};

export const getSurveyDetailsByShopOwnerID = async (haatStatusId: any) => {
  const userDetails = decodeJwtToken();
  const response = await commonApi(
    `user/getSurveyDetailsByShopOwnerID?UserDashboardStatus=${haatStatusId}&ShopOwnerID=${userDetails?.UserID}`
  );
  return response?.data || [];
};

export const saveFinalApprovalByApprovalOfficerID = async (
  selectedSurvey: any,
  approvalAction: string,
  remarksText: string
) => {
  const payload = {
    survey_id: selectedSurvey?.survey_id,
    final_approval_status: approvalAction === "approve" ? 1 : 2,
    remarks: remarksText || "",
    approval_officer_id: decodeJwtToken()?.UserID,
  };
  const response = await commonApi(
    `user/saveFinalApprovalByApprovalOfficerID`,
    payload
  );
  return response?.data || [];
};

export const getHearingDetailsByHearingUserID = async (haatStatusId: any) => {
  const userDetails = decodeJwtToken();
  const response = await commonApi(
    `user/getHearingDetailsByHearingUserID?HearingStateStatus=${haatStatusId}&UserID=${userDetails?.UserID}`
  );
  return response?.data || [];
};

export const getSurveyDetailsByApprovalOfficerID = async (
  haatStatusId: any
) => {
  const userDetails = decodeJwtToken();
  const response = await commonApi(
    `user/getSurveyDetailsByApprovalOfficerID?ApprovedDashboardStatus=${haatStatusId}&ApprovalOfficerID=${userDetails?.UserID}`
  );
  return response?.data || [];
};

export const getHaatManagerDashboardDtlsByHaatManagerID = async (
  haatStatusId: any
) => {
  const userDetails = decodeJwtToken();
  const response = await commonApi(
    `user/getHaatManagerDashboardDtlsByHaatManagerID?HaatManagerStatus=${haatStatusId}&HaatManagerID=${userDetails?.UserID}`
  );
  return response?.data || [];
};

export const fetchFullApplicationDetails = async (surveyId: string) => {
  const token = Cookies.get("token");
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

  const response: any = await fetch(
    BASE_API_URL + "user/getHaatApplicationDetailsBySurveyID",
    requestOptions
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response?.status}: ${await response?.text()}`);
  }
  const result = await response.json();

  // Fetch images
  const stall_image1 = await commonApiImage(result?.data?.stall_image1 || "");
  const stall_image2 = await commonApiImage(result?.data?.stall_image2 || "");
  const pan_image = await commonApiImage(result?.data?.pan_image || "");
  const sketch_map_attached = await commonApiImage(
    result?.data?.sketch_map_attached || ""
  );
  const document_image = await commonApiImage(
    result?.data?.document_image || ""
  );
  const residential_certificate_attached = await commonApiImage(
    result?.data?.residential_certificate_attached || ""
  );
  const trade_license_attached = await commonApiImage(
    result?.data?.trade_license_attached || ""
  );
  const affidavit_attached = await commonApiImage(
    result?.data?.affidavit_attached || ""
  );
  const warision_certificate_attached = await commonApiImage(
    result?.data?.warision_certificate_attached || ""
  );
  const death_certificate_attached = await commonApiImage(
    result?.data?.death_certificate_attached || ""
  );
  const noc_legal_heirs_attached = await commonApiImage(
    result?.data?.noc_legal_heirs_attached || ""
  );

  return {
    ...result?.data,
    stall_image1,
    stall_image2,
    pan_image,
    sketch_map_attached,
    residential_certificate_attached,
    document_image,
    trade_license_attached,
    affidavit_attached,
    warision_certificate_attached,
    noc_legal_heirs_attached,
    death_certificate_attached,
  };
};

export const saveHearingDateByCheckerID = async (
  selectedSurveys: number[],
  hearingDate: string
) => {
  const userDetails = decodeJwtToken();
  const response = await commonApi("user/saveHearingDateByCheckerID", {
    lstSurveyId: selectedSurveys,
    entry_user_id: userDetails?.UserID,
    hearing_date: hearingDate,
  });
  return response;
};

export const submitRemarksAction = async (
  selectedSurveyForRemarks: number,
  remarksText: string,
  approvalAction: string,
  userType: number
) => {
  const userDetails = decodeJwtToken();
  const payload: Record<string, any> = {};
  payload[userType === 70 ? "survey_id" : "survey_id"] =
    selectedSurveyForRemarks;
  payload[userType === 70 ? "approval_officer_id" : "entry_user_id"] =
    userDetails?.UserID;
  payload[userType === 70 ? "remarks" : "remarks"] = remarksText;
  payload[userType === 70 ? "final_approval_status" : "approval_status"] =
    approvalAction === "approve" ? 1 : 2;
  const url =
    userType === 70
      ? `user/saveFinalApprovalByApprovalOfficerID`
      : `user/updateApprovedHearingDetailsByHearingUserID`;
  const response = await commonApi(url, payload);
  return response;
};

export const getCertificateDetails = async (applicationNumber: string) => {
  const url = `user/getShopOwnerCertificateDetails?ApplicationNumber=${applicationNumber}`;
  const response = await commonApi(url, {});
  return response;
};

export const getSurveyDetailsForMakerByBoundaryID = async (
  boundaryLevelId: number,
  boundaryId: number,
  statusId: number,
  startDate: string,
  endDate: string
) => {
  const userDetails = decodeJwtToken();
  const payload = {
    boundary_level_id: boundaryLevelId,
    boundary_id: boundaryId,
    user_id: userDetails?.UserID,
    status_id: statusId,
    start_date: startDate,
    end_date: endDate,
  };

  const response = await commonApi(
    `user/getSurveyDetailsForMakerByBoundaryID`,
    payload
  );
  return response?.data || [];
};

function formatDateToDDMMYYYY(date: any): string | null {
  if (!date) return null;
  let d: Date;
  if (typeof date === "string") {
    // Try parse string to Date
    d = new Date(date);
    if (Number.isNaN(d.getTime())) return null;
  } else if (date instanceof Date) {
    d = date;
  } else {
    return null;
  }
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export const updateSurveyDetailsByMaker = async (
  files: MakerUploadFiles,
  applicationDetails: Record<string, any>
) => {
  const token = Cookies.get("token");

  const headers = new Headers();
  headers.append("accept", "*/*");
  headers.append("Authorization", `Bearer ${token}`);
  // ❌ DO NOT set Content-Type (browser sets boundary)

  const formData = new FormData();

  /* ================= FILE PARTS ================= */
  const fileMap: Record<string, File | Blob | undefined> = {
    document_image: files.documentImage,
    pan_image: files.panImage,
    residential_certificate_attached: files.residentialCertificateAttached,
    trade_license_attached: files.tradeLicenseAttached,
    affidavit_attached: files.affidavitAttached,
    warision_certificate_attached: files.warisionCertificateAttached,
    death_certificate_attached: files.deathCertificateAttached,
    noc_legal_heirs_attached: files.nocLegalHeirsAttached,
    sketch_map_attached: files.sketchMapAttached,
    stall_image1: files.stallImage1,
    stall_image2: files.stallImage2,
  };

  Object.entries(fileMap).forEach(([key, file]) => {
    if (file) formData.append(key, file);
  });

  /* ================= JSON PAYLOAD ================= */
  // Matching Java backend structure: Integer, Long, Double, String types
  const payload = {
    // Long
    survey_id: Number(applicationDetails.survey_id ?? 0),

    // Integer
    license_type: Number(applicationDetails.license_type ?? 0),
    application_status: Number(applicationDetails.application_status ?? 0),
    applicant_type: Number(applicationDetails.applicant_type ?? 0),
    usage_type: Number(applicationDetails.usage_type ?? 0),
    active_status: Number(applicationDetails.active_status ?? 0),

    /* Applicant - String */
    name: String(applicationDetails.name?.trim() || " "),
    guardian_name: String(applicationDetails.guardian_name?.trim() || " "),
    address: String(applicationDetails.address?.trim() || " "),
    mobile: String(applicationDetails.mobile?.trim() || " "),
    citizenship: String(applicationDetails.citizenship?.trim() || " "),

    // Integer
    pin_code: Number(applicationDetails.pin_code ?? 0),
    is_within_family: Number(applicationDetails.is_within_family ?? 0),
    transfer_relationship: Number(
      applicationDetails.transfer_relationship ?? 0
    ),

    // String
    document_type: String(applicationDetails.document_type?.trim() || " "),
    document_no: String(applicationDetails.document_no?.trim() || " "),
    pan: String(applicationDetails.pan?.trim() || " "),

    /* Existing - String */
    previous_license_no: String(applicationDetails.previous_license_no || " "),
    license_expiry_date: formatDateToDDMMYYYY(
      applicationDetails.license_expiry_date
    ),
    // Integer
    property_tax_payment_to_year: Number(
      applicationDetails.property_tax_payment_to_year ?? 0
    ),

    /* Transfer - String */
    land_transfer_explanation: String(
      applicationDetails.land_transfer_explanation?.trim() || " "
    ),
    // Integer
    occupy: Number(applicationDetails.occupy ?? 0),
    occupy_from_year: Number(applicationDetails.occupy_from_year ?? 0),
    // String
    present_occupier_name: String(
      applicationDetails.present_occupier_name?.trim() || " "
    ),
    occupier_guardian_name: String(
      applicationDetails.occupier_guardian_name?.trim() || " "
    ),
    adsr_name: String(applicationDetails.adsr_name?.trim() || " "),
    // Integer
    is_same_owner: Number(applicationDetails.is_same_owner ?? 0),
    // String
    rented_to_whom: applicationDetails.rented_to_whom || null,

    /* Plot - Integer */
    district_id: Number(applicationDetails.district_id ?? 0),
    is_urban: Number(applicationDetails.is_urban ?? 0),
    police_station_id: Number(applicationDetails.police_station_id ?? 0),
    hat_id: Number(applicationDetails.hat_id ?? 0),
    mouza_id: Number(applicationDetails.mouza_id ?? 0),

    // String
    stall_no: String(applicationDetails.stall_no?.trim() || " "),
    holding_no: String(applicationDetails.holding_no?.trim() || " "),
    jl_no: String(applicationDetails.jl_no?.trim() || " "),
    khatian_no: String(applicationDetails.khatian_no?.trim() || " "),
    plot_no: String(applicationDetails.plot_no?.trim() || " "),
    // Double
    area_com_sqft: Number(applicationDetails.area_com_sqft ?? 0),
    latitude: Number(applicationDetails.latitude ?? 0),
    longitude: Number(applicationDetails.longitude ?? 0),
    land_valuation_amount: Number(
      applicationDetails.land_valuation_amount ?? 0
    ),

    // String
    remarks: String(applicationDetails.remarks?.trim() || " "),
    // Long
    user_id: Number(applicationDetails.user_id ?? 0),

    /* Hearing / Approval - String */
    hearing_date: formatDateToDDMMYYYY(applicationDetails.hearing_date),
    hearing_approved_date: formatDateToDDMMYYYY(
      applicationDetails.hearing_approved_date
    ),
    hearing_remarks: String(applicationDetails.hearing_remarks?.trim() || " "),
    hearing_approved_by: String(
      applicationDetails.hearing_approved_by?.trim() || " "
    ),
    approval_remarks: String(
      applicationDetails.approval_remarks?.trim() || " "
    ),
    approval_date: formatDateToDDMMYYYY(applicationDetails.approval_date),
    survey_approved_by: String(
      applicationDetails.survey_approved_by?.trim() || " "
    ),

    /* Payment - Double */
    initial_amount: Number(applicationDetails.initial_amount ?? 0),
    final_amount: Number(applicationDetails.final_amount ?? 0),
    // Integer
    initial_payment_status: Number(
      applicationDetails.initial_payment_status ?? 0
    ),
    final_payment_status: Number(applicationDetails.final_payment_status ?? 0),
    // String
    initial_payment_date: formatDateToDDMMYYYY(
      applicationDetails.initial_payment_date
    ),
    final_payment_date: formatDateToDDMMYYYY(
      applicationDetails.final_payment_date
    ),

    /* Location breakup - Integer */
    block_id: Number(applicationDetails.block_id ?? 0),
    panchayet_id: Number(applicationDetails.panchayet_id ?? 0),
    municipality_id: Number(applicationDetails.municipality_id ?? 0),
    ward_id: Number(applicationDetails.ward_id ?? 0),
    ward_no: Number(applicationDetails.ward_no ?? 0),
  };

  /* 🔑 BACKEND EXPECTS STRINGIFIED JSON */
  formData.append("applicationDetials", JSON.stringify(payload));

  /* ================= API CALL ================= */
  const response = await fetch(
    BASE_API_URL + "user/updateSurveyDetailsByMaker",
    {
      method: "POST",
      headers,
      body: formData,
    }
  );
  const data = await response.json();
  const isHttpOk = response.ok;
  const status = typeof data.status === "number" ? data.status : undefined;
  const message: string = typeof data.message === "string" ? data.message : "";
  const messageIndicatesSuccess = /success/i.test(message);

  const isBusinessOk = status === 0 || status === 1 || messageIndicatesSuccess;

  if (!isHttpOk || !isBusinessOk) {
    throw new Error(message || "Failed to update survey");
  }

  return data;
};

export const getRelationshipDetails = async (): Promise<any> => {
  const token = Cookies.get("token");
  const headers = new Headers();
  headers.append("accept", "");
  headers.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  const apiUrl = `${BASE_API_URL}user/getRelationshipDetails`;

  const response = await fetch(apiUrl, requestOptions);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return response.json();
};

export const getMouzaListByPoliceStationID = async (
  policeStationID: number
): Promise<any> => {
  const token = Cookies.get("token");
  const headers = new Headers();
  headers.append("accept", "*/*");
  headers.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    redirect: "follow",
  };

  const apiUrl = `${BASE_API_URL}user/getMouzaListByPoliceStationID?PoliceStationID=${policeStationID}`;

  const response = await fetch(apiUrl, requestOptions);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return response.json();
};

export const getJLNoByPoliceStationID = async (
  policeStationID: number
): Promise<any> => {
  const token = Cookies.get("token");
  const headers = new Headers();
  headers.append("accept", "*/*");
  headers.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    redirect: "follow",
  };

  const apiUrl = `${BASE_API_URL}user/getJLNO?PoliceStationID=${policeStationID}`;

  const response = await fetch(apiUrl, requestOptions);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return response.json();
};

export const getADSRNameByPoliceStationID = async (
  policeStationID: number
): Promise<any> => {
  const token = Cookies.get("token");
  const headers = new Headers();
  headers.append("accept", "*/*");
  headers.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    redirect: "follow",
  };

  const apiUrl = `${BASE_API_URL}user/getADSRName?PoliceStationID=${policeStationID}`;

  const response = await fetch(apiUrl, requestOptions);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return response.json();
};

export const getThanaListByDistrictID = async (
  districtID: number
): Promise<any> => {
  const token = Cookies.get("token");
  const headers = new Headers();
  headers.append("accept", "*/*");
  headers.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    redirect: "follow",
  };

  const url = `${BASE_API_URL}user/getThanaListByDistrictID?DistrictID=${districtID}`;

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return response.json();
};

export const getBoundaryDetailsByBoundaryID = async (
  boundaryLevelID: number,
  boundaryID: number,
  isUrban: number,
  loginUserID: number
): Promise<any> => {
  const token = Cookies.get("token");
  const headers = new Headers();
  headers.append("accept", "*/*");
  headers.append("Authorization", `Bearer ${token}`);
  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    redirect: "follow",
  };

  const apiUrl = `${BASE_API_URL}user/getBoundaryDetailsByBoundaryID?BoundaryLevelID=${boundaryLevelID}&BoundaryID=${boundaryID}&IsUrban=${isUrban}&LoginUserID=${loginUserID}`;
  const response = await fetch(apiUrl, requestOptions);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return response.json();
};

export const getAllHaatDetailsByDistrictID = async (
  districtID: number
): Promise<any> => {
  const token = Cookies.get("token");
  const headers = new Headers();
  headers.append("accept", "*/*");
  headers.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    redirect: "follow",
  };

  const apiUrl = `${BASE_API_URL}user/getAllHaatDetailsByDistrictID?DistrictID=${districtID}`;
  const response = await fetch(apiUrl, requestOptions);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return response.json();
};

// ==========================================
// From Service/surveyApi.ts (Unique Functions)
// ==========================================

export const fetchApplicationDetails = async (surveyId: string) => {
  const token = Cookies.get("token");
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
    `${BASE_API_URL}user/getHaatApplicationDetailsBySurveyID`,
    requestOptions
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }
  const result = await response.json();

  const getImage = (path: string | null | undefined) =>
    commonApiImage(path || "");

  const processedData = {
    ...result?.data,
    stall_image1: await getImage(result?.data?.stall_image1),
    stall_image2: await getImage(result?.data?.stall_image2),
    pan_image: await getImage(result?.data?.pan_image),
    sketch_map_attached: await getImage(result?.data?.sketch_map_attached),
    document_image: await getImage(result?.data?.document_image),
    residential_certificate_attached: await getImage(
      result?.data?.residential_certificate_attached
    ),
    trade_license_attached: await getImage(
      result?.data?.trade_license_attached
    ),
    affidavit_attached: await getImage(result?.data?.affidavit_attached),
    warision_certificate_attached: await getImage(
      result?.data?.warision_certificate_attached
    ),
    death_certificate_attached: await getImage(
      result?.data?.death_certificate_attached
    ),
    noc_legal_heirs_attached: await getImage(
      result?.data?.noc_legal_heirs_attached
    ),
  };

  return processedData;
};

export const getHaatApplicationDetailsForAdminApi = async (
  haatStatusId: string
) => {
  const userDetails = decodeJwtToken();
  const payload = {
    userID: userDetails?.UserID,
    from_date: null,
    to_date: null,
    haatDashoardStatus: haatStatusId,
  };
  return commonApi(`user/getHaatApplicantionDetailsForAdmin`, payload);
};

export const getCheckerDashboardDetailsApi = async (haatStatusId: string) => {
  const userDetails = decodeJwtToken();
  return commonApi(
    `user/getCheckerDashboardDetails?CheckerDashboardStatus=${haatStatusId}&UserID=${userDetails?.UserID}`
  );
};

export const savePaymentDetailsApi = async (
  payload: SavePaymentDetailsPayload
) => {
  return commonApi(`user/savePaymentDetailsBySurveyID`, payload);
};

export const getHearingDetailsByHearingUserApi = async (
  haatStatusId: string
) => {
  const userDetails = decodeJwtToken();
  return commonApi(
    `user/getHearingDetailsByHearingUserID?HearingStateStatus=${haatStatusId}&UserID=${userDetails?.UserID}`
  );
};

export const getSurveyDetailsByApprovalOfficerApi = async (
  haatStatusId: string
) => {
  const userDetails = decodeJwtToken();
  return commonApi(
    `user/getSurveyDetailsByApprovalOfficerID?ApprovedDashboardStatus=${haatStatusId}&ApprovalOfficerID=${userDetails?.UserID}`
  );
};

export const saveHearingDateByCheckerApi = async (
  payload: SaveHearingDatePayload
) => {
  return commonApi("user/saveHearingDateByCheckerID", payload);
};

export const updateApprovedHearingDetailsApi = async (
  payload: UpdateApprovalStatusPayload
) => {
  return commonApi(`user/updateApprovedHearingDetailsByHearingUserID`, payload);
};

export const saveFinalApprovalByApprovalOfficerApi = async (
  payload: SaveFinalApprovalPayload
) => {
  return commonApi(`user/saveFinalApprovalByApprovalOfficerID`, payload);
};



//----------Payment API-------------------

export const savePaymentInfo = async (payload: SavePaymentInfoPayload) => {
  return await commonApi("user/savePaymentInfo", payload);
};
export interface SavePaymentInfoPayload {
  initial_or_final_payment_status: number;
  survey_id: number;
  depositor_name: string;
  depositor_mobile_no: string;
  depositor_email_address: string;
  depositor_address: string;
  amount: number;
  entry_user_id: number;
}

export const getPaymentDetilsByTxnRefID = async (txnRefID: number | string) => {
  return await commonApi(
    `user/getPaymentDetilsByTxnRefID?TxnRefID=${txnRefID}`,
    {},
    "POST"
  );
};


