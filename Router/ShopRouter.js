const express = require("express");
const upload = require("../MiddleWare/Multer");
const { createShop, getAllShops, getShopById, updateShop, deleteShop } = require("../Controller/ShopController");

const ShopRouter = express.Router();


// Routes
ShopRouter.post("/create-shop", upload.single("shopImage"), createShop);
ShopRouter.get("/get-shops", getAllShops);
ShopRouter.get("/shop-by-id/:id", getShopById);
ShopRouter.put("/update-shop/:id", upload.single("shopImage"), updateShop);
ShopRouter.delete("/delete-shop/:id", deleteShop);

module.exports = ShopRouter;
