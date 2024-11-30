const express = require("express");
const { createMainCategory, getAllMainCategories, getSingleMainCategory, updateMainCategory, deleteMainCategory, getAllMainCategoriesStatusTrue, getSingleMainCategoryByName } = require("../Controller/MainCategoryController");
const upload = require("../MiddleWare/Multer");
const MainCategoryRouter = express.Router();


// Define routes
MainCategoryRouter.post("/create-main-category" ,upload.single("mainCategoryImage"), createMainCategory);
MainCategoryRouter.get("/get-main-category", getAllMainCategories);
MainCategoryRouter.get("/get-main-category-by-status", getAllMainCategoriesStatusTrue);
MainCategoryRouter.get("/get-single-main-category/:id", getSingleMainCategory);
MainCategoryRouter.get("/get-main-category/by-name/:name", getSingleMainCategoryByName);
MainCategoryRouter.put("/update-main-category/:id",upload.single("mainCategoryImage"), updateMainCategory);
MainCategoryRouter.delete("/delete-main-category/:id", deleteMainCategory);

module.exports = MainCategoryRouter;
