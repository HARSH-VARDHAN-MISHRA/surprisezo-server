const { createSubcategory, getAllSubcategories, getSubcategoryById, updateSubcategory, deleteSubcategory, getAllSubcategoriesStatusTrue, getSubcategoryByName, getAllSubcategoryByCategoryName } = require("../Controller/SubcategoryController");
const upload = require("../MiddleWare/Multer");

const SubcCategoryRouter = require("express").Router()

SubcCategoryRouter.post("/create-subcategory", upload.single('subcategoryImage'), createSubcategory);
SubcCategoryRouter.get("/get-subcategory", getAllSubcategories);
SubcCategoryRouter.get("/get-subcategory-by-status", getAllSubcategoriesStatusTrue);
SubcCategoryRouter.get("/get-single-subcategory/:id", getSubcategoryById);
SubcCategoryRouter.get("/get-subcategory-by-name/:name", getSubcategoryByName);
SubcCategoryRouter.get("/get-subcategory-by-category-name/:categoryName", getAllSubcategoryByCategoryName);
SubcCategoryRouter.put("/update-subcategory/:id", upload.single('subcategoryImage'), updateSubcategory);
SubcCategoryRouter.delete("/delete-subcategory/:id", deleteSubcategory);


module.exports = SubcCategoryRouter