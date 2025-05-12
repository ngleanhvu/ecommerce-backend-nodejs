const { model, Schema } = require('mongoose');
const { collection } = require('./shop.model');
const slugify = require('slugify')

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
    product_slug: {
        type: String
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
        ref: "Shop" 
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    // more
    product_rating_average: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val*10)/10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// Document middleware: run before .save() and .create() // other: pre, post, validate, remove, deleteOne, deleteMany.....
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, {lower: true})
    next()
})

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

const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: {
        type: String
    },
    material: {
        type: String
    },
    product_shop: {
        type: Schema.Types.ObjectId, ref: "Shop"
    }
},{
    collection: "furnitures",
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model("Electronics", electronicSchema),
    clothing: model("Clothing", clothingSchema),
    furniture: model("Furniture", furnitureSchema)
};
