import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import AddItemForm from "./AddItemForm";
import './Shop.css';
import AvailableItems from "./AvailableItems";

interface User {
    email?: string;
    name?: string;
    isAdmin?: boolean;
}

const Shop: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [itemsList, setItemsList] = useState({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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
                setUser(data);
            } catch (error) {
                console.error(error);
            }
        };

        const getallItems = async () => {
            try {

            } catch (error) {

            }
        }

        getUserInfo();
        getallItems();
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
            setError(null); // Clear error on successful addition
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || 'An unexpected error occurred');
            } else {
                setError('An unexpected error occurred');
            }
            console.error(error);
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
                        <AvailableItems />
                    </div>
                </>
            ) : (
                <div className="other-content">Other content here</div>
            )}
        </div>
    );
};

export default Shop;
