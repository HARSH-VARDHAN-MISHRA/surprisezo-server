const express = require("express");
const { createShopProduct, getAllShopProducts, getShopProductById, updateShopProduct, deleteShopProduct, getAllShopProductsByShopName, getAllShopProductsByShopCategoryName } = require("../Controller/shopProductController");
const ShopProductRouter = express.Router();

// Create
ShopProductRouter.post("/add-shop-product", createShopProduct);

// Get all
ShopProductRouter.get("/get-shop-product", getAllShopProducts);

// Get one
ShopProductRouter.get("/get-single-shop-product/:id", getShopProductById);
ShopProductRouter.get("/get-shop-product-by-shopname/:shopName", getAllShopProductsByShopName);
ShopProductRouter.get("/get-shop-product-by-shopcategoryname/:shopCategoryName", getAllShopProductsByShopCategoryName);

// Update
ShopProductRouter.put("/update-shop-product/:id", updateShopProduct);

// Delete
ShopProductRouter.delete("/delete-shop-product/:id", deleteShopProduct);

module.exports = ShopProductRouter;
