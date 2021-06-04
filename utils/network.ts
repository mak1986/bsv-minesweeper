import axios from "axios";

export default axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        // withCredentials: true,
    }
});