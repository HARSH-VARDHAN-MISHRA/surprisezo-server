const express = require("express");
const { createShopCategory, getCategoriesByShop, updateShopCategory, deleteShopCategory, getCategories, getCategoriesByShopName } = require("../Controller/ShopCategoryController");
const upload = require("../MiddleWare/Multer");


const ShopcategoryRouter = express.Router();

// Routes for shop categories
ShopcategoryRouter.post("/add-shop-category",upload.single("shopCategoryImage"), createShopCategory);
ShopcategoryRouter.get("/get-shop-category/:id", getCategoriesByShop);
ShopcategoryRouter.get("/get-shop-category", getCategories);
ShopcategoryRouter.get("/get-shop-category-by-shopname/:shopname", getCategoriesByShopName);
ShopcategoryRouter.put("/update-shop-category/:id",upload.single("shopCategoryImage"), updateShopCategory);
ShopcategoryRouter.delete("/delete-shop-category/:id", deleteShopCategory);

module.exports = ShopcategoryRouter;
