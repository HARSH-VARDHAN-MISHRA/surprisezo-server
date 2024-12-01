const mongoose = require("mongoose")

const ShopCategorySchema = new mongoose.Schema({
    shopName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    shopCategoryName: {
        type: String,
        required: true
    },
    shopCategoryImage:{
        type:String,
        required:true
    },
    productExit: {
        type: Boolean,
        default: false
    }
})


const ShopCategory = mongoose.model("ShopCategory", ShopCategorySchema)

module.exports = ShopCategory