export interface User {
    userId?: string;
    email?: string;
    name?: string;
    isAdmin?: boolean;
}

export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    image: string;
}

export interface CartItem {
    _id: string;
    title: string;
    price: number;
    quantity: number;
}
