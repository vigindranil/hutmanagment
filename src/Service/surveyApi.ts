import Cookies from "js-cookie";
import { commonApi, commonApiImage } from "./commonAPI";
import { decodeJwtToken } from "../utils/decodeToken";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

interface SaveHearingDatePayload {
  lstSurveyId: number[];
  entry_user_id: number;
  hearing_date: string;
}

interface UpdateApprovalStatusPayload {
  survey_id: number;
  entry_user_id: number;
  remarks: string;
  approval_status: 1 | 2; // 1 for approve, 2 for reject
}

interface SaveFinalApprovalPayload {
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

// --- API Service Functions ---

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

  const getImage = (path: string | null | undefined) => commonApiImage(path || "");

  const processedData = {
    ...result?.data,
    stall_image1: await getImage(result?.data?.stall_image1),
    stall_image2: await getImage(result?.data?.stall_image2),
    pan_image: await getImage(result?.data?.pan_image),
    sketch_map_attached: await getImage(result?.data?.sketch_map_attached),
    document_image: await getImage(result?.data?.document_image),
    residential_certificate_attached: await getImage(result?.data?.residential_certificate_attached),
    trade_license_attached: await getImage(result?.data?.trade_license_attached),
    affidavit_attached: await getImage(result?.data?.affidavit_attached),
    warision_certificate_attached: await getImage(result?.data?.warision_certificate_attached),
    death_certificate_attached: await getImage(result?.data?.death_certificate_attached),
    noc_legal_heirs_attached: await getImage(result?.data?.noc_legal_heirs_attached),
  };

  return processedData;
};

export const getHaatApplicationDetailsForAdminApi = async (haatStatusId: string) => {
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

export const savePaymentDetailsApi = async (payload: SavePaymentDetailsPayload) => {
  return commonApi(`user/savePaymentDetailsBySurveyID`, payload);
};

export const getSurveyDetailsByShopOwnerApi = async (haatStatusId: string) => {
  const userDetails = decodeJwtToken();
  return commonApi(
    `user/getSurveyDetailsByShopOwnerID?UserDashboardStatus=${haatStatusId}&ShopOwnerID=${userDetails?.UserID}`
  );
};

export const getHearingDetailsByHearingUserApi = async (haatStatusId: string) => {
  const userDetails = decodeJwtToken();
  return commonApi(
    `user/getHearingDetailsByHearingUserID?HearingStateStatus=${haatStatusId}&UserID=${userDetails?.UserID}`
  );
};

export const getSurveyDetailsByApprovalOfficerApi = async (haatStatusId: string) => {
  const userDetails = decodeJwtToken();
  return commonApi(
    `user/getSurveyDetailsByApprovalOfficerID?ApprovedDashboardStatus=${haatStatusId}&ApprovalOfficerID=${userDetails?.UserID}`
  );
};

export const saveHearingDateByCheckerApi = async (payload: SaveHearingDatePayload) => {
  return commonApi("user/saveHearingDateByCheckerID", payload);
};

export const updateApprovedHearingDetailsApi = async (payload: UpdateApprovalStatusPayload) => {
  return commonApi(`user/updateApprovedHearingDetailsByHearingUserID`, payload);
};

export const saveFinalApprovalByApprovalOfficerApi = async (payload: SaveFinalApprovalPayload) => {
  return commonApi(`user/saveFinalApprovalByApprovalOfficerID`, payload);
};