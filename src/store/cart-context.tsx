import React from 'react';
import { CartItem } from '../types';

export type CartContextType = {
    items: CartItem[];
    totalAmount: number;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    setItems: (items: CartItem[]) => void;
    applyCoupon: (coupon: string) => void;
};

const CartContext = React.createContext<CartContextType>({
    items: [],
    totalAmount: 0,
    addItem: () => {},
    removeItem: () => {},
    setItems: () => {},
    applyCoupon: () => {}
});

export default CartContext;
