const mongoose = require('mongoose');

const productCategorieSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: 1,
        maxlength: 100
    }
});

const ProductCategories = mongoose.model('ProductCategories', productCategorieSchema);
module.exports = {ProductCategories};