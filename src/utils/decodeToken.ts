import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';


export function decodeJwtToken(): any | null {
    try {
        const token = Cookies.get('token');
        const decoded_data = jwtDecode<any>(token || "");
        return decoded_data?.userDetails ? JSON.parse(decoded_data?.userDetails) : null;
    } catch (err) {
        console.error('Invalid token:', err);
        return null;
    }
}

