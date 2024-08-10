import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { User, Product } from "../../types";
import AddItemForm from "./AddItemForm";
import AvailableItems from "./AvailableItems";
import ShoppingItems from "./ShoppingItems";
import CartContext from "../../store/cart-context";
import './Shop.css';

const Shop: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [itemsList, setItemsList] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const cartContext = useContext(CartContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch user information
                const token = localStorage.getItem('token');
                if (token) {
                    const userResponse = await fetch('https://ecommerce-backend-9rxn7rxj9-aman-s1s-projects.vercel.app/shop', {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    if (userResponse.ok) {
                        const userData: User = await userResponse.json();
                        setUser(userData);
                    } else {
                        throw new Error('Failed to fetch user info');
                    }
                }

                // Fetch all products
                const productsResponse = await fetch('https://ecommerce-backend-9rxn7rxj9-aman-s1s-projects.vercel.app/shop/products', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token || ''}` },
                });
                if (productsResponse.ok) {
                    const productsData: Product[] = await productsResponse.json();
                    setItemsList(productsData);
                } else {
                    throw new Error('Failed to fetch products');
                }

                // Fetch cart items
                const cartResponse = await fetch('https://ecommerce-backend-9rxn7rxj9-aman-s1s-projects.vercel.app/cart/get-items', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (cartResponse.ok) {
                    const cartData = await cartResponse.json();
                    cartContext.setItems(cartData.cartItems);
                } else {
                    throw new Error('Failed to fetch cart items');
                }
            } catch (error) {
                console.error(error);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [cartContext]);

    const handleAddItem = async (name: string, description: string, price: number, image: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await fetch('https://ecommerce-backend-9rxn7rxj9-aman-s1s-projects.vercel.app/shop/add-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title: name, description, price, image }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add item');
            }

            const addedItem = await response.json();
            setItemsList(prevItems => [...prevItems, addedItem.item]);
            setError(null);
        } catch (error: unknown) {
            setError((error as Error).message || 'An unexpected error occurred');
            console.error(error);
        }
    };

    const handleRemoveItem = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await fetch(`https://ecommerce-backend-9rxn7rxj9-aman-s1s-projects.vercel.app/shop/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove item');
            }

            setItemsList(prevItems => prevItems.filter(item => item._id !== id));
            setError(null);
        } catch (error: unknown) {
            setError((error as Error).message || 'An unexpected error occurred');
            console.error(error);
        }
    };

    const handleAddToCart = async (id: string) => {
        const selectedProduct = itemsList.find(item => item._id === id);
        if (selectedProduct) {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found');

                const response = await fetch('https://ecommerce-backend-9rxn7rxj9-aman-s1s-projects.vercel.app/cart/add-item', {
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
                cartContext.addItem({
                    _id: selectedProduct._id,
                    title: selectedProduct.title,
                    price: selectedProduct.price,
                    quantity: 1,
                });
                console.log(`Item with id ${selectedProduct._id} added to cart`);
            } catch (error: unknown) {
                console.error('Error adding item to cart:', error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="shop-container">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <h3 className="welcome-message">Welcome {user?.email},</h3>
            {user?.isAdmin ? (
                <>
                    <div className="admin-message">Admin</div>
                    <AddItemForm onAddItem={handleAddItem} />
                    {error && <div className="error-message">{error}</div>}
                    <div className="items-list">
                        <AvailableItems items={itemsList} onRemoveItem={handleRemoveItem} />
                    </div>
                </>
            ) : (
                <>
                    <button className="cart-button" onClick={() => navigate('/cart')}>Go To Cart</button>
                    <div className="other-content">
                        <ShoppingItems items={itemsList} onAddToCart={handleAddToCart} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Shop;
