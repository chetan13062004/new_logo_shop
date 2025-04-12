import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

// Define the CartItem interface
export interface CartItem {
  clientId: string;
  product: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  countInStock: number;
  quantity: number;
  color?: string;
  size?: string;
}

// Define the ShippingAddress interface
export interface ShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  postalCode: string;
  street: string;
  province: string;
  country: string;
}

// Define the Cart interface
export interface Cart {
  items: CartItem[];
  shippingAddress: ShippingAddress | null;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  deliveryDateIndex: number;
  expectedDeliveryDate: Date | null;
}

// Define the CartStore interface
interface CartStore {
  cart: Cart;
  addItem: (item: CartItem, quantity: number) => Promise<void>;
  updateItem: (item: CartItem, quantity: number) => Promise<void>;
  removeItem: (item: CartItem) => void;
  clearCart: () => void;
  setShippingAddress: (shippingAddress: ShippingAddress) => void; // Added this
  setPaymentMethod: (paymentMethod: string) => void; // Added this
  updateDeliveryDateIndex: (index: number) => void; // Added this
}

// Define the type for the persist configuration
type CartPersistConfig = {
  name: string;
  storage?: Storage;
  getStorage: () => Storage;
};

// Create the cart store
const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: {
        items: [],
        shippingAddress: null,
        paymentMethod: '',
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
        deliveryDateIndex: 0,
        expectedDeliveryDate: null,
      },
      addItem: async (item: CartItem, quantity: number) => {
        const { items, shippingAddress } = get().cart;
        const existItem = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        );

        if (existItem) {
          if (existItem.countInStock < quantity + existItem.quantity) {
            throw new Error('Not enough items in stock');
          }
        } else {
          if (item.countInStock < item.quantity) {
            throw new Error('Not enough items in stock');
          }
        }

        const updatedCartItems = existItem
          ? items.map((x) =>
              x.product === item.product &&
              x.color === item.color &&
              x.size === item.size
                ? { ...existItem, quantity: existItem.quantity + quantity }
                : x
            )
          : [
              ...items,
              {
                ...item,
                quantity,
                clientId: uuidv4(),
              },
            ];

        // Calculate totals
        const itemsPrice = updatedCartItems.reduce(
          (a: number, c: CartItem) => a + c.price * c.quantity,
          0
        );
        const shippingPrice = 0; // You can calculate this based on your business logic
        const taxPrice = 0; // You can calculate this based on your business logic
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
          },
        });
      },
      updateItem: async (item: CartItem, quantity: number) => {
        const { items, shippingAddress } = get().cart;
        const exist = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        );
        if (!exist) return;
        const updatedCartItems = items.map((x) =>
          x.product === item.product &&
          x.color === item.color &&
          x.size === item.size
            ? { ...exist, quantity: quantity }
            : x
        );
        
        // Calculate totals
        const itemsPrice = updatedCartItems.reduce(
          (a: number, c: CartItem) => a + c.price * c.quantity,
          0
        );
        const shippingPrice = 0; // You can calculate this based on your business logic
        const taxPrice = 0; // You can calculate this based on your business logic
        const totalPrice = itemsPrice + shippingPrice + taxPrice;
        
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
          },
        });
      },
      removeItem: (item: CartItem) => {
        const { items } = get().cart;
        const updatedCartItems = items.filter(
          (x) => x.clientId !== item.clientId
        );
        
        // Calculate totals
        const itemsPrice = updatedCartItems.reduce(
          (a: number, c: CartItem) => a + c.price * c.quantity,
          0
        );
        const shippingPrice = 0; // You can calculate this based on your business logic
        const taxPrice = 0; // You can calculate this based on your business logic
        const totalPrice = itemsPrice + shippingPrice + taxPrice;
        
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
          },
        });
      },
      clearCart: () => {
        set({
          cart: {
            ...get().cart,
            items: [],
            itemsPrice: 0,
            shippingPrice: 0,
            taxPrice: 0,
            totalPrice: 0,
          },
        });
      },
      setShippingAddress: (shippingAddress: ShippingAddress) => {
        set({
          cart: {
            ...get().cart,
            shippingAddress,
          },
        });
      },
      setPaymentMethod: (paymentMethod: string) => {
        set({
          cart: {
            ...get().cart,
            paymentMethod,
          },
        });
      },
      updateDeliveryDateIndex: (index: number) => {
        set({
          cart: {
            ...get().cart,
            deliveryDateIndex: index,
          },
        });
      },
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    } as PersistOptions<CartStore, unknown> & CartPersistConfig
  )
);

export default useCartStore;