const mongoose = require("mongoose")

const SubCategorySchema = new mongoose.Schema({
    categoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "Main-Category",
        required: true
    },
    subcategoryName: {
        type: String,
        required: true
    },
    subcategoryStatus: {
        type: String,
        default: "False"
    },
    subcategoryImage: {
        type: String, // URL or path to the image
        required: false
    },
    innersubcategoryExit: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Subcategory = mongoose.model("Subcategory", SubCategorySchema)

module.exports = Subcategory