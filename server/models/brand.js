const mongoose = require('mongoose');

// Schema method of mongoose
const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: 1,
        maxlength: 100
    }
});

const Brand = mongoose.model('Brand', brandSchema);
module.exports = {Brand};