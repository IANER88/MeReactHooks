import { create } from "zustand";

type TUseStore = {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
}


const useStore = create<TUseStore>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))

export default useStore;