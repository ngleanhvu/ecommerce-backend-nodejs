const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Product schema
const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_desc: {
        type: String,
    },
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronics', "Clothing", "Furniture"]
    },
    product_shop: { 
        type: Schema.Types.ObjectId, 
        ref: "User" 
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// Clothing schema
const clothingSchema = new Schema({
    brand: {
        type: String
    },
    material: String,
    size: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    collection: "clothes",
    timestamps: true
});

// Electronic schema
const electronicSchema = new Schema({
    manufacturer: {
        type: String,
        required: true
    }, 
    color: String,
    model: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    collection: "electronics",
    timestamps: true
});

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model("Electronics", electronicSchema),
    clothing: model("Clothing", clothingSchema)
};
