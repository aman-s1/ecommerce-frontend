import React from 'react';
import { CartItem } from '../types';

type CartContextType = {
    items: CartItem[];
    totalAmount: number;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
};

const CartContext = React.createContext<CartContextType>({
    items: [],
    totalAmount: 0,
    addItem: () => {},
    removeItem: () => {},
});

export default CartContext;
