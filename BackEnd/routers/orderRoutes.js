const express=require("express");
const router= express.Router();
const { isAuthenticated,authorizedRole } = require("../middleware/auth");
const { newOrder, Orders, getSingleOrder, getAllOrders, deleteOrder, updateOrder } = require("../controllers/OrderController");
const { updateRole } = require("../controllers/userControll");





router.route('/order/new').post(isAuthenticated,newOrder);
router.route('/order/:id').get(isAuthenticated,authorizedRole("admin"),getSingleOrder);
router.route('/orders/me').get(isAuthenticated,Orders);
router.route('/admin/order').get(isAuthenticated,authorizedRole("admin"),getAllOrders);

router.route('/admin/order/:id').put(isAuthenticated,authorizedRole("admin"), updateOrder).delete(isAuthenticated,authorizedRole("admin"), deleteOrder)









module.exports=router;