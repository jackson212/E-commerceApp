const express = require("express");
const { getAllProdcuts, createProduct,updateProduct ,deleteProduct ,ProductDetail, createProductReview, deleteReview, getProductReviews} = require("../controllers/productController");
const { isAuthenticated,authorizedRole } = require("../middleware/auth");
const router = express.Router();



router.route('/products').get(isAuthenticated,authorizedRole("admin") ,getAllProdcuts);
router.route('/product/new').post(isAuthenticated,createProduct)
router.route('/product/:id').put(isAuthenticated,updateProduct)
router.route('/product/:id').delete(isAuthenticated,deleteProduct)
router.route('/product/:id').get(ProductDetail)
 
router.route('/products/reviews').put(isAuthenticated,createProductReview)
router.route('/products/reviews').get(isAuthenticated,getProductReviews).delete(isAuthenticated,deleteReview)
 
module.exports=router

