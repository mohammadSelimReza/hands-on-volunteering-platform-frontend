import axios from "axios";

const authApiInstance = () =>{
    const access_token = localStorage.getItem("access_token");
    
    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {Authorization: `Bearer ${access_token}`}
    })

    return axiosInstance;
}

export default authApiInstance;