import { create } from "zustand";

interface States {
  authEmail: string;
  authType?: string;
  orderId?: string;
}

interface Actions {
  setAuthEmail: (email: string) => void;

  setAuthType: (authType: string, orderId: string) => void;
}

const useAuthEmailStore = create<States & Actions>()((set) => ({
  authEmail: "",
  accessToken: "",
  authType: "",
  orderId: "",

  setAuthEmail: (authEmail: string) => {
    set({ authEmail });
  },

  setAuthType: (authType, orderId) => {
    set({
      authType,
      orderId,
    });
  },
}));

export default useAuthEmailStore;
