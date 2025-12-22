import { commonApi, commonApiImage } from "../../Service/commonAPI";
import { decodeJwtToken } from "../../utils/decodeToken";
import Cookies from "js-cookie";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

// API Functions
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

  const response = await commonApi(`user/savePaymentDetailsBySurveyID`, payload);
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

export const getSurveyDetailsByApprovalOfficerID = async (haatStatusId: any) => {
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

export const updateSurveyDetailsByMaker = async (
  files: MakerUploadFiles,
  applicationDetails: Record<string, any>
) => {
  const token = Cookies.get("token");
  const headers = new Headers();
  headers.append("accept", "*/*");
  headers.append("Authorization", `Bearer ${token}`);

  const formdata = new FormData();
  const appendFile = (key: keyof MakerUploadFiles, file?: File | Blob) => {
    if (!file) return;
    const fileName = (file as File)?.name || `${String(key)}.jpg`;
    formdata.append(key, file, fileName);
  };

  appendFile("documentImage", files.documentImage);
  appendFile("panImage", files.panImage);
  appendFile(
    "residentialCertificateAttached",
    files.residentialCertificateAttached
  );
  appendFile("tradeLicenseAttached", files.tradeLicenseAttached);
  appendFile("affidavitAttached", files.affidavitAttached);
  appendFile("warisionCertificateAttached", files.warisionCertificateAttached);
  appendFile("deathCertificateAttached", files.deathCertificateAttached);
  appendFile("nocLegalHeirsAttached", files.nocLegalHeirsAttached);
  appendFile("landValuationDoc", files.landValuationDoc);
  appendFile("sketchMapAttached", files.sketchMapAttached);
  appendFile("stallImage1", files.stallImage1);
  appendFile("stallImage2", files.stallImage2);

  formdata.append("applicationDetials", JSON.stringify(applicationDetails));

  const response = await fetch(
    BASE_API_URL + "user/updateSurveyDetailsByMaker",
    {
      method: "POST",
      headers,
      body: formdata,
      redirect: "follow",
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return response.json();
};

