import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

const useSkillsInterestStore = create(
  persist(
    (set, get) => ({
      skillsList: [],
      interestsList: [],

      fetchSkillsList: async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/skills/list/`);
          console.log("Fetched skills:", res.data);
          set({ skillsList: res.data });
        } catch (error) {
          console.error("Error fetching skills:", error);
        }
      },

      fetchInterestsList: async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/interests/list/`);
          console.log("Fetched interests:", res.data);
          set({ interestsList: res.data });
        } catch (error) {
          console.error("Error fetching interests:", error);
        }
      },
    }),
    {
      name: "skills-interests-store",
    }
  )
);

// ✅ Auto-fetch skills and interests when the store is initialized
(async () => {
  const store = useSkillsInterestStore.getState();
  await store.fetchSkillsList();
  await store.fetchInterestsList();
})();

export default useSkillsInterestStore;
