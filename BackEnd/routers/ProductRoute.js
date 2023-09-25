const express = require("express");
const { getAllProdcuts, createProduct,updateProduct ,deleteProduct ,ProductDetail} = require("../controllers/productController");

const router = express.Router();


router.route('/products').get(getAllProdcuts);
router.route('/product/new').post(createProduct)
router.route('/product/:id').put(updateProduct).delete(deleteProduct).get()
router.route('/product/:id').delete(deleteProduct)
router.route('/product/:id').get(ProductDetail)


module.exports=router