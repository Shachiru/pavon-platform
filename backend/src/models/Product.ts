import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
        type: String,
        required: true,
        enum: ['Phones', 'Laptops', 'Tablets', 'Smartwatches', 'Headphones', 'Accessories', 'Other']
    },
    brand: { type: String, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Device-specific specifications
    specifications: {
        processor: { type: String },
        ram: { type: String },
        storage: { type: String },
        display: { type: String },
        battery: { type: String },
        camera: { type: String },
        os: { type: String },
        color: { type: String },
        warranty: { type: String },
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    discount: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

// Text index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

export default mongoose.model('Product', productSchema);