import { User } from "@/constants/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface States {
  // basicInfo:
}

interface Actions {}

const useUserStore = create(
  persist<States & Actions>((set) => ({}), {
    name: "new-email-campaign",
    storage: createJSONStorage(() => sessionStorage),
  })
);

export default useUserStore;
