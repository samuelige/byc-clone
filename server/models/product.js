const mongoose = require('mongoose'); // MongoDB abstraction layer
const schema = mongoose.Schema; // Mongoose schema

// Schema method of mongoose
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: 1,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 10000,
    },
    price: {
        type: Number,
        required: true,
        maxlength: 255
    },
    brand: {
        type: schema.Types.ObjectId,
        ref: 'Brand',
        required: true  // required: true means that the field is required 
    },
    shipping: {
        type: Boolean,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
    productCategory: {
        type: schema.Types.ObjectId,
        ref: 'ProductCategories',
        required: true
    },
    size: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    sold: {
        type: Number,
        maxlength: 255,
        default: 0
    },
    publish: {
        type: Boolean,
        required: true
    },
    images: {
        type: Array,
        default: []
    },
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);
module.exports = {Product};