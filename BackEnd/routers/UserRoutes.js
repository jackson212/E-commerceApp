const express =require('express')
const {register,login, updatePassword,logout, forgotpassword, resetpassword, getuserDetails, getSingleuser, updateprofile, getAlluser, DeleteUser, updateRole} =require('../controllers/userControll')

const { isAuthenticated,authorizedRole } = require("../middleware/auth");
const { createProductReview } = require('../controllers/productController');


const router=express.Router();

router.route("/register").post(register)

router.route('/login').post(login)

router.route('/password/forgot').post(forgotpassword)

router.route('/password/reset/:token').put(resetpassword)

router.route('/logout').get(logout)

router.route('/me').get( isAuthenticated,getuserDetails)

router.route('/updatepassword').put(isAuthenticated,updatePassword)

router.route('/updateprofile').put(isAuthenticated,updateprofile)

router.route("/admin/users").get(isAuthenticated,authorizedRole("admin"),getAlluser)


 
router.route("/admin/users/:id").get(isAuthenticated,authorizedRole("admin"),getSingleuser)
.put(isAuthenticated,updateRole)
.delete(isAuthenticated,authorizedRole("admin"),DeleteUser)






module.exports=router
