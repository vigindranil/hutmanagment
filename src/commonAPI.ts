import Cookies from 'js-cookie';
import { BASE_API_URL } from './constants';

export const commonApi = async (url: string, body: any = {}) => {
    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("Content-Type", "application/json");
    const token = Cookies.get('token');
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(body)
    };

    const result = await fetch(BASE_API_URL + url , requestOptions);
    return await result.json();

  }