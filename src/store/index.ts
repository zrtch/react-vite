import { create } from 'zustand'

const useBearStore = create((set) => ({
  bears: 0,
  add: () => set((state) => ({ bears: state.bears + 1 })),
  delete: () => set((state) => ({bears: state.bears - 1})),
  remove: () => set({ bears: 0 }),
}))

export default useBearStore
