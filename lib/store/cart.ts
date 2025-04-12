import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  clientId: string
  product: string
  name: string
  slug: string
  category: string
  image: string
  price: number
  countInStock: number
  quantity: number
  size: string
  color: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (clientId: string) => void
  updateQuantity: (clientId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (newItem) => 
        set((state) => {
          // Check if item already exists with same product, size and color
          const existingItemIndex = state.items.findIndex(
            (item) => 
              item.product === newItem.product && 
              item.size === newItem.size && 
              item.color === newItem.color
          )
          
          if (existingItemIndex >= 0) {
            // Update quantity if item exists
            const updatedItems = [...state.items]
            const existingItem = updatedItems[existingItemIndex]
            
            // Calculate new quantity, but don't exceed stock
            const newQuantity = Math.min(
              existingItem.quantity + newItem.quantity,
              existingItem.countInStock
            )
            
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity
            }
            
            return { items: updatedItems }
          } else {
            // Add new item
            return { items: [...state.items, newItem] }
          }
        }),
      
      removeItem: (clientId) => 
        set((state) => ({
          items: state.items.filter((item) => item.clientId !== clientId)
        })),
      
      updateQuantity: (clientId, quantity) => 
        set((state) => ({
          items: state.items.map((item) => 
            item.clientId === clientId
              ? { ...item, quantity: Math.min(quantity, item.countInStock) }
              : item
          )
        })),
      
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'cart-storage', // name of the item in localStorage
    }
  )
)