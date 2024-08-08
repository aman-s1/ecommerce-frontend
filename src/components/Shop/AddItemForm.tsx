import React, { useState } from "react";
import './AddItemForm.css';

interface AddItemFormProps {
    onAddItem: (name: string, description: string, price: number, image: string) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = (props) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState<number | "">("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Validate form fields
        if (name.trim() === "" || description.trim() === "" || image.trim() === "" || +price <= 0) {
            setError("All fields are required and price must be greater than 0");
            return;
        }

        setError(null);
        props.onAddItem(name, description, price as number, image);
        setName("");
        setDescription("");
        setImage("");
        setPrice("");
    };

    return (
        <form className="add-item-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <input 
                type="text" 
                placeholder="Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Image URL" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
            />
            <input 
                type="number" 
                placeholder="Price" 
                value={price} 
                onChange={(e) => setPrice(parseFloat(e.target.value) || "")} 
            />
            <button type="submit">Add Item</button>
        </form>
    );
};

export default AddItemForm;
