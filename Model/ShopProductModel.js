const mongoose = require("mongoose")

const shpProductSchema = new mongoose.Schema({
    shopName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    shopCategoryName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShopCategory",
    },
    shopProduct: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Product",
    }
})

const ShopProduct = mongoose.model("ShopProduct", shpProductSchema)

module.exports = ShopProduct