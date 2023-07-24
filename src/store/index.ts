import { create } from 'zustand'

const useStore  = create((set) => ({
  bears: 0,
  name: 'zustand',
  age: 18,
  add: () => set((state) => ({ bears: state.bears + 1 })),
  delete: () => set((state) => ({bears: state.bears - 1})),
  remove: () => set({ bears: 0 }),
}), false)


export default useStore 
