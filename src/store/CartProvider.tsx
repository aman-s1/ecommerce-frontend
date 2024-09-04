import React, { useReducer } from 'react';
import CartContext, { CartContextType } from './cart-context';
import { CartItem } from '../types';

const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const SET_ITEMS = 'SET_ITEMS';
const APPLY_COUPON = 'APPLY_COUPON';

interface CartState {
    items: CartItem[];
    totalAmount: number;
}

interface CartAction {
    type: string;
    item?: CartItem;
    id?: string;
    items?: CartItem[];
    coupon?: string; // Added coupon code
}

const defaultCartState: CartState = {
    items: [],
    totalAmount: 0,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case ADD_ITEM: {
            const updatedTotalAmount = state.totalAmount + (action.item?.price ?? 0) * (action.item?.quantity ?? 0);

            const existingCartItemIndex = state.items.findIndex(item => item._id === action.item?._id);
            const existingCartItem = state.items[existingCartItemIndex];
            let updatedItems;

            if (existingCartItem) {
                const updatedItem = {
                    ...existingCartItem,
                    quantity: existingCartItem.quantity + (action.item?.quantity ?? 0),
                };
                updatedItems = [...state.items];
                updatedItems[existingCartItemIndex] = updatedItem;
            } else {
                updatedItems = state.items.concat(action.item!);
            }

            return {
                items: updatedItems,
                totalAmount: updatedTotalAmount,
            };
        }

        case REMOVE_ITEM: {
            const existingCartItemIndex = state.items.findIndex(item => item._id === action.id);
            const existingItem = state.items[existingCartItemIndex];
            if (!existingItem) return state;

            const updatedTotalAmount = state.totalAmount - existingItem.price;
            let updatedItems;

            if (existingItem.quantity === 1) {
                updatedItems = state.items.filter(item => item._id !== action.id);
            } else {
                const updatedItem = { ...existingItem, quantity: existingItem.quantity - 1 };
                updatedItems = [...state.items];
                updatedItems[existingCartItemIndex] = updatedItem;
            }

            return {
                items: updatedItems,
                totalAmount: updatedTotalAmount,
            };
        }

        case SET_ITEMS: {
            const newItems = Array.isArray(action.items) ? action.items : [];
            const newTotalAmount = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return {
                items: newItems,
                totalAmount: newTotalAmount,
            };
        }

        case APPLY_COUPON: {
            if (!action.coupon) return state;
            
            let discountPercentage = 0;

            if (action.coupon === 'DIWALIDHAMAKA') {
                discountPercentage = 20;
            } else if (action.coupon === 'CHRISTMASCHARITY') {
                discountPercentage = 20; 
            }

            const discountAmount = (state.totalAmount * discountPercentage) / 100;
            const newTotalAmount = Math.max(state.totalAmount - discountAmount, 0);

            return {
                ...state,
                totalAmount: newTotalAmount,
            };
        }

        default:
            return state;
    }
};

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);

    const addItemToCartHandler = (item: CartItem) => {
        dispatchCartAction({ type: ADD_ITEM, item });
    };

    const removeItemFromCartHandler = (id: string) => {
        dispatchCartAction({ type: REMOVE_ITEM, id });
    };

    const setItemsHandler = (items: CartItem[]) => {
        dispatchCartAction({ type: SET_ITEMS, items });
    };

    const applyCouponHandler = (coupon: string) => {
        dispatchCartAction({ type: APPLY_COUPON, coupon });
    };

    const cartContext: CartContextType = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItem: addItemToCartHandler,
        removeItem: removeItemFromCartHandler,
        setItems: setItemsHandler,
        applyCoupon: applyCouponHandler,
    };

    return (
        <CartContext.Provider value={cartContext}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
