const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        logoUrl: { type: String, required: true },
        website: { type: String },
        description: { type: String }, 
        createdAt: { type: Date, default: Date.now },
    },
    { collection: 'brands' }
);

const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);

module.exports = Brand;