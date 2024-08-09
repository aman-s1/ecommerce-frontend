import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { User, Product, CartItem } from "../../types";
import AddItemForm from "./AddItemForm";
import AvailableItems from "./AvailableItems";
import ShoppingItems from "./ShoppingItems";
import CartContext from "../../store/cart-context";

import './Shop.css';

const Shop: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [itemsList, setItemsList] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const cartContext = useContext(CartContext);

    useEffect(() => {
        // Fetch user information
        const getUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:5000/shop', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user info');
                }

                const data: User = await response.json();
                console.log(data);
                setUser(data);
            } catch (error) {
                console.error(error);
                setError('Failed to load user information');
            }
        };

        // Fetch all products
        const getAllItems = async () => {
            try {
                const response = await fetch('http://localhost:5000/shop/products', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data: Product[] = await response.json();
                console.log(data);
                setItemsList(data);
            } catch (error) {
                console.error(error);
                setError('Failed to load products');
            }
        };

        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:5000/cart/get-items', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }

                const data = await response.json();
                console.log(data.cartItems);
                cartContext.setItems(data.cartItems);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setError('Failed to load cart items');
            }
        };

        getAllItems();
        getUserInfo();
        fetchCartItems();
    }, []);

    const handleAddItem = async (name: string, description: string, price: number, image: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found');
                return;
            }

            const response = await fetch('http://localhost:5000/shop/add-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: name,
                    description,
                    price,
                    image
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add item');
            }

            const addedItem = await response.json();
            console.log(addedItem);
            setItemsList(prevItems => [...prevItems, addedItem.item]);
            setError(null);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || 'An unexpected error occurred');
            } else {
                setError('An unexpected error occurred');
            }
            console.error(error);
        }
    };

    // Remove item from database and frontend
    const handleRemoveItem = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found');
                return;
            }
    
            const response = await fetch(`http://localhost:5000/shop/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove item');
            }

            setItemsList(prevItems => prevItems.filter(item => item._id !== id));
            setError(null);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || 'An unexpected error occurred');
            } else {
                setError('An unexpected error occurred');
            }
            console.error(error);
        }
    };    

    // Add item to backend and Cart Context
    const handleAddToCart = async (id: string) => {
        const selectedProduct = itemsList.find(item => item._id === id);
        if (selectedProduct) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }
    
                const response = await fetch('http://localhost:5000/cart/add-item', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        itemId: selectedProduct._id,
                        quantity: 1,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to add item to cart');
                }
    
                const responseData = await response.json();
                console.log(`Item with id ${selectedProduct._id} added to cart in backend`);
    
                // Add item to cart context
                cartContext.addItem({
                    _id: selectedProduct._id,
                    title: selectedProduct.title,
                    price: selectedProduct.price,
                    quantity: 1,
                });
                console.log(`Item with id ${selectedProduct._id} added to cart context`);
            } catch (error) {
                console.error('Error adding item to cart:', error);
            }
        }
    };    

    return (
        <div className="shop-container">
            <h3 className="welcome-message">Welcome {user?.email},</h3>
            {user?.isAdmin ? (
                <>
                    <div className="admin-message">Admin</div>
                    <AddItemForm onAddItem={handleAddItem} />
                    {error && <div className="error-message">{error}</div>}
                    <div className="items-list">
                        <AvailableItems items={itemsList} onRemoveItem={handleRemoveItem}/>
                    </div>
                </>
            ) : (
                <>
                    <><button className="cart-button" onClick={()=>{navigate('/cart')}}>Go To Cart</button></>
                    <div className="other-content">
                        <ShoppingItems items={itemsList} onAddToCart={handleAddToCart} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Shop;
