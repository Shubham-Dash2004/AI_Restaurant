import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['breakfast', 'lunch', 'dinner', 'beverages', 'dessert']
    },
    item: {
        type: String,
        required: true,
    },
    description: String,
    price: {
        type: Number,
        required: true,
    },
});

export default mongoose.model('Menu', MenuSchema);