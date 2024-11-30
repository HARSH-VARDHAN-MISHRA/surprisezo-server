const express = require("express");
const { createShopCategory, getCategoriesByShop, updateShopCategory, deleteShopCategory, getCategories } = require("../Controller/ShopCategoryController");


const ShopcategoryRouter = express.Router();

// Routes for shop categories
ShopcategoryRouter.post("/add-shop-category", createShopCategory);
ShopcategoryRouter.get("/get-shop-category/:id", getCategoriesByShop);
ShopcategoryRouter.get("/get-shop-category", getCategories);
ShopcategoryRouter.put("/update-shop-category/:id", updateShopCategory);
ShopcategoryRouter.delete("/delete-shop-category/:id", deleteShopCategory);

module.exports = ShopcategoryRouter;
