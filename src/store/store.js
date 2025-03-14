import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";



const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: localStorage.getItem("access_token") || null,
      isAuthenticated: !!localStorage.getItem("access_token"),

      // Login User
      login: async (email, password) => {
        try {
          const response = await axios.post(`${API_BASE_URL}/user/token/`, {
            email,
            password,
          });
          const { access, refresh } = response.data;

          // Store tokens in localStorage
          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);

          // Decode token to get user data
          await get().restoreSession(access);

          return { success: true };
        } catch (error) {
          console.error("Login error:", error.response?.data);
          return { success: false, error: error.response?.data };
        }
      },

      // Logout User
      logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateProfile: async (user_id, userData) => {
        try {
          const res = await axios.patch(`${API_BASE_URL}/user/${user_id}/profile/update/`, userData);
          console.log("Profile Updated:", res.data);
          useUserStore.getState().restoreSession();
          return res.data; // ✅ Return response
        } catch (error) {
          console.error("Profile Update Failed:", error.response ? error.response.data : error.message);
          throw error; // ✅ Rethrow the error so handleSubmit can catch it
        }
      },
      // Restore User Session on Page Load
      restoreSession: async (accessToken = null) => {
        const token = accessToken || localStorage.getItem("access_token");
        if (!token) return;

        try {
          const decoded = jwtDecode(token);
          const expTime = decoded.exp * 1000;
          const currentTime = Date.now();
          const userData = await axios.get(
            `${API_BASE_URL}/user/list/${decoded.user_id}/`
          );
          if (expTime > currentTime) {
            set({ user: userData.data, isAuthenticated: true });
          } else {
            console.warn("Token expired. Logging out.");
            get().refreshToken();
          }
        } catch (error) {
          console.error("Token decode failed:", error);
          get().logout();
        }
      },

      // Refresh Token if Access Token is Expired
      refreshToken: async () => {
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (!refreshToken) {
            get().logout();
            return;
          }

          const response = await axios.post(
            `${API_BASE_URL}/user/token/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          const { access } = response.data;
          localStorage.setItem("access_token", access);
          get().restoreSession(access);
        } catch (error) {
          console.error("Token refresh failed:", error.response?.data);
          get().logout();
        }
      },
      // store user data
    }),
    {
      name: "user-storage",
      getStorage: () => localStorage,
    }
  )
);

// Auto-restore session on page load
useUserStore.getState().restoreSession();

export default useUserStore;
