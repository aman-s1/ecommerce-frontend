import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../../store/cart-context';
import './Cart.css';

const Cart: React.FC = () => {
    const [coupon, setCoupon] = useState<string>("");
    const [isCouponValid, setIsCouponValid] = useState<boolean | null>(null); // State to track coupon validity

    const cartContext = useContext(CartContext);
    const navigate = useNavigate();

    const handleIncreaseQuantity = async (id: string) => {
        const cartItem = cartContext.items.find(item => item._id === id);
        if (cartItem) {
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
                    body: JSON.stringify({ itemId: id, quantity: 1 }),
                });

                if (!response.ok) {
                    throw new Error('Failed to increase item quantity');
                }

                cartContext.addItem({ ...cartItem, quantity: (cartItem.quantity || 0) + 1 });
            } catch (error) {
                console.error('Error increasing item quantity:', error);
            }
        }
    };

    const handleDecreaseQuantity = async (id: string) => {
        const cartItem = cartContext.items.find(item => item._id === id);
        if (cartItem && cartItem.quantity > 0) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }

                const response = await fetch('http://localhost:5000/cart/delete-item', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ itemId: id, quantity: 1 }),
                });

                if (!response.ok) {
                    throw new Error('Failed to decrease item quantity');
                }

                cartContext.removeItem(id);
            } catch (error) {
                console.error('Error decreasing item quantity:', error);
            }
        }
    };

    const checkCouponCode = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
    
            const response = await fetch('http://localhost:5000/cart/check-coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ coupon: coupon }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to check coupon code');
            }
    
            const data = await response.json();
            if (data.isValid) {
                setIsCouponValid(true);
                cartContext.applyCoupon(coupon); // Pass coupon to applyCoupon if needed
                alert('Coupon applied successfully!');
            } else {
                setIsCouponValid(false);
                alert('Invalid coupon code.');
            }
        } catch (err) {
            console.error('Error checking coupon:', err);
            setIsCouponValid(false);
        }
    };    

    const handleCheckout = () => {
        if (cartContext.items.length === 0) {
            alert('Your cart is empty. Please add items to your cart before proceeding to checkout.');
            return;
        }

        localStorage.setItem('coupon', coupon);
        navigate('/checkout');
    };

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            {cartContext.items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul className="cart-items">
                    {cartContext.items.map(item => (
                        <li key={item._id} className="cart-item">
                            <div className="item-info">
                                <h3>{item.title}</h3>
                                <div className="item-price-quantity">
                                    <span className="item-price">
                                        ${item.price ? item.price.toFixed(2) : '0.00'}
                                    </span>
                                    <div className="quantity-controls">
                                        <button onClick={() => handleDecreaseQuantity(item._id)}>-</button>
                                        <span className="item-quantity">{item.quantity}</span>
                                        <button onClick={() => handleIncreaseQuantity(item._id)}>+</button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <div className="cart-summary">
                <h3>
                    Total Amount: ${cartContext.totalAmount ? cartContext.totalAmount.toFixed(2) : '0.00'}
                </h3>
                <input
                    type='text'
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder='Enter Coupon Code'
                />
                <button onClick={checkCouponCode}>Apply Coupon</button>
                {isCouponValid === false && <p className="error-message">Invalid coupon code. Please try again.</p>}
                <button className="checkout-button" onClick={handleCheckout}>Proceed to Checkout</button>
            </div>
        </div>
    );
};

export default Cart;
