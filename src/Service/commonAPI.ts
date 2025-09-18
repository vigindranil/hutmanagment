import Cookies from 'js-cookie';
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const commonApi = async (url: string, body: any = {}, type="POST") => {
  const myHeaders = new Headers();
  myHeaders.append("accept", "*/*");
  myHeaders.append("Content-Type", "application/json");
  const token = Cookies.get('token');
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = 
  type == "POST" ? 
   {
    method: type,
    headers: myHeaders,
    body: JSON.stringify(body)
  } : {
    method: type,
    headers: myHeaders
  };
  const result = await fetch(BASE_API_URL + url, requestOptions);
  return await result.json();
}

export const getIdentityDocument = async (documentPath: string) => {
  const token = Cookies.get('token')
  const url = `${BASE_API_URL}/getImgAsBase64ByFileName/${documentPath}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'accept': '*/*',
      'Authorization': `Bearer ${token}`,
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
