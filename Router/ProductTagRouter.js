const express = require("express");
const { createProductTag, updateProductTag, deleteProductTag, getAllProductTags, getProductTagById, getProductTagByHeading, getProductsByTagAndPriceRange } = require("../Controller/ProductTagController");
const upload = require("../MiddleWare/Multer");

const ProductTagRouter = express.Router();

ProductTagRouter.post("/create-producttag", createProductTag);

ProductTagRouter.get("/get-producttag", getAllProductTags);
ProductTagRouter.get("/single-producttag/:id", getProductTagById);
ProductTagRouter.get('/get-product-tag-by-taghrading/:tagHeading', getProductTagByHeading);
ProductTagRouter.get('/get-product-tag-by-taghrading-and-range/:tagHeading', getProductsByTagAndPriceRange);


ProductTagRouter.put("/update-producttag/:id",updateProductTag);

ProductTagRouter.delete("/delete-producttag/:id", deleteProductTag);

module.exports = ProductTagRouter;
