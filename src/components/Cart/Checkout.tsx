import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../../store/cart-context';
import './Checkout.css';

const Checkout: React.FC = () => {
    const [address, setAddress] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const cartContext = useContext(CartContext);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Check if the cart is empty
        if (cartContext.items.length === 0) {
            alert('Your cart is empty. Please add items to your cart before proceeding to checkout.');
            return;
        }

        // Prepare order data
        const orderData = {
            address,
            totalAmount: cartContext.totalAmount,
            orderItems: cartContext.items.map(item => ({
                itemId: item._id,
                quantity: item.quantity,
            })),
        };

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await fetch('https://ecommerce-backend-rnh6j2c3d-aman-s1s-projects.vercel.app//cart/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit the order');
            }

            cartContext.setItems([]);

            setSuccessMessage('Order placed successfully! Redirecting to shop...');

            setTimeout(() => {
                navigate('/shop');
            }, 2000);

        } catch (error) {
            console.error('Error submitting order:', error);
        }
    };

    return (
        <div className="checkout-form">
            <h3>Checkout</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="address">Address:</label>
                <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}
        </div>
    );
};

export default Checkout;
