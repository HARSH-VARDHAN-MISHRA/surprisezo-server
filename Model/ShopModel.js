const mongoose = require("mongoose")

const shopSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: true
    },
    shopImage: {
        type: String,
        required: true
    },
    exitShopCategory: {
        type: Boolean,
        default: false
    }
})

const shop = mongoose.model("Shop", shopSchema)

module.exports = shop