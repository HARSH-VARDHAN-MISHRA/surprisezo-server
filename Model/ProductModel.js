const mongoose = require("mongoose")

const VariantSchema = new mongoose.Schema({
    color: {
        type: mongoose.Schema.ObjectId,
        ref: "Color",
        default: null
    },
    weight: {
        type: mongoose.Schema.ObjectId,
        ref: "Size",
        default: null
    },
    flover: {
        type: mongoose.Schema.ObjectId,
        ref: "Flover",
        default: null
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    finalPrice: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        default: 0
    },
    eggLess: {
        type: String,
        // required: true
    }
});

const productSchema = new mongoose.Schema({
    categoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "Main-Category",
        required: true
    },
    subcategoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "Subcategory",
        default: null
    },
    innersubcategoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "InnerSubcategory",
        default: null
    },
    productName: {
        type: String,
        required: true,
    },
    productSubDescription: {
        type: String,
        default: null
    },
    productDescription: {
        type: String,
        default: null
    },
    productTag: {
        type: mongoose.Schema.ObjectId,
        ref: "TagModel",
        default: null
    },
    refrenceCompany: {
        type: mongoose.Schema.ObjectId,
        ref: "RefrenceCompany",
        default: null
    },
    refrenceCompanyUrl: {
        type: String,
    },
    customisecake: {
        type: String,
    },
    customisemessage: {
        type: String,
    },
    customisename: {
        type: String,
    },
    customisenameValue: {
        type: String,
    },
    deliveryin: {
        type: String,
    },
    timeslot: {
        type: String,
    },
    Variant: {
        type: [VariantSchema],
        required: true,
    },
    productImage: {
        type: [String],
        required: true
    },
    sku: {
        type: String,
        default: "SKU--000001"
    }
})


const Product = mongoose.model("Product", productSchema)

module.exports = Product