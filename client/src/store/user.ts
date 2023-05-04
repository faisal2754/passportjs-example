import { create } from "zustand";

interface IUserStore {
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  removeAccessToken: () => void;
}

const useUserStore = create<IUserStore>()((set) => ({
  accessToken: "",
  setAccessToken: (accessToken: string) => set({ accessToken: accessToken }),
  removeAccessToken: () => set({ accessToken: "" }),
}));

export { useUserStore };
