import { User } from "@/constants/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface States {
  user: User | null;
  isPending: boolean;
}

interface Actions {
  setUser: (user: User | null) => void;
  setIsPending: (value: boolean) => void;
}

const useUserStore = create(
  persist<States & Actions>(
    (set) => ({
      user: null,
      isPending: true,
      setUser: (user: User | null) => set({ user }),
      setIsPending: (value) => set({ isPending: value }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserStore;
