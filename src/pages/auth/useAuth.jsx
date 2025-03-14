import axios from "axios";
const API_BASE_URL="http://127.0.0.1:8000/api/v1"
const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default apiInstance;