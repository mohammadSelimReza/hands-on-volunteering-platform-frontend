import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_BASE_URL=import.meta.env.VITE_API_URL

const useSkillsInterestStore = create(
  persist(
    (set, get) => ({
      skillsList: [],
      interestsList: [],

      fetchSkillsList: async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/skills/list/`);
          set({ skillsList: res.data });
        } catch (error) {
          console.log("Fetching")
        }
      },

      fetchInterestsList: async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/interests/list/`);
          set({ interestsList: res.data });
        } catch (error) {
          console.log("Fetching")
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
