import React from 'react';
import { Product } from '../../types';
import Card from '../UI/Card';
import './AvailableItems.css';

interface AvailableItemsProps {
    items: Product[];
    onRemoveItem: (id: string) => void;
}

const AvailableItems: React.FC<AvailableItemsProps> = ({ items, onRemoveItem }) => {

    const itemRemoveHandler = (id: string) => {
        onRemoveItem(id);
    };

    return (
        <div className="available-items">
            {items.length > 0 ? (
                items.map(item => (
                    <Card key={item._id}>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                        <img src={item.image} alt={item.title} />
                        <p>${item.price.toFixed(2)}</p>
                        <button onClick={() => itemRemoveHandler(item._id)}>Remove</button> {/* Corrected */}
                    </Card>
                ))
            ) : (
                <p>No items available</p>
            )}
        </div>
    );
};

export default AvailableItems;
