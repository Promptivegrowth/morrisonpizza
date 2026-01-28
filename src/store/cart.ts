import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // Unique ID for cart item
    name: string;
    description?: string;
    price: number;
    quantity: number;
    type: 'pizza' | 'combo' | 'other';
    details?: string; // For customized pizzas (e.g. "Mitad Hawaiana, Mitad Americana")
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (item) => set((state) => {
                const existingItem = state.items.find(i =>
                    i.name === item.name &&
                    i.details === item.details &&
                    i.price === item.price
                );
                if (existingItem) {
                    return {
                        items: state.items.map(i =>
                            i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i
                        )
                    };
                }
                return { items: [...state.items, { ...item, id: Math.random().toString(36).substring(7) }] };
            }),
            removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            updateQuantity: (id, delta) => set((state) => {
                const newItems = state.items.map((i) => {
                    if (i.id === id) {
                        const newQty = i.quantity + delta;
                        return newQty > 0 ? { ...i, quantity: newQty } : null;
                    }
                    return i;
                }).filter(Boolean) as CartItem[];
                return { items: newItems };
            }),
            clearCart: () => set({ items: [] }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            total: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        }),
        {
            name: 'morrison-cart-storage',
        }
    )
);
