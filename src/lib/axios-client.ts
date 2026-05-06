import axios from "axios";
import { jwtDecode } from "jwt-decode";

const DEFAULT_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const STORAGE_TOKEN_KEY = "pubcore_auth_token";

const instance = axios.create({
  baseURL: DEFAULT_URL,
});

// Request interceptor to add JWT token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const getAuthToken = () => localStorage.getItem(STORAGE_TOKEN_KEY);
export const setAuthToken = (token: string) =>
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
export const clearAuthToken = () => localStorage.removeItem(STORAGE_TOKEN_KEY);

export const isTokenValid = (token?: string) => {
  try {
    const t = token || getAuthToken();
    if (!t) return false;
    const decoded = jwtDecode(t);
    return decoded.exp ? decoded.exp * 1000 > Date.now() : true;
  } catch {
    return false;
  }
};

export default instance;
