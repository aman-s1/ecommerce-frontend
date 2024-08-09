import React from 'react';
import { Product } from '../../types';
import Card from '../UI/Card';
import './ShoppingItems.css';

interface ShoppingItemsProps {
    items: Product[];
    onAddToCart: (id: string) => void;
}

const ShoppingItems: React.FC<ShoppingItemsProps> = ({ items, onAddToCart }) => {
    return (
        <div className="shopping-items">
            {items.length > 0 ? (
                items.map(item => (
                    <Card key={item._id}>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                        <img src={item.image} alt={item.title} />
                        <p>${item.price.toFixed(2)}</p>
                        <button onClick={() => onAddToCart(item._id)}>Add to Cart</button>
                    </Card>
                ))
            ) : (
                <p>No items available</p>
            )}
        </div>
    );
};

export default ShoppingItems;
