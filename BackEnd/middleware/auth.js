const User=require('../model/userModel')
const ErrorHandler = require("../utils/errorhandler");
const catchasync = require("./catchasync");
const jwt =require("jsonwebtoken")

exports.isAuthenticated = catchasync( async(req,res,next)=>{

 const {token} =req.cookies

if(!token){

    return next(new ErrorHandler("please login to acces this resource ",401))
}

const  decodedData=jwt.verify(token,process.env.JWT_SECRET);


req.user =await User.findById(decodedData.id )        //finding the user??


next()
  
})

exports.authorizedRole=(...roles)=>{
    

    return(req,res,next)=>{
       
        console.log(req.user.role)
        
        if(!roles.includes(req.user.role)){
            

          return  next(
         new ErrorHandler(`Role : ${req.user.role}  cannot access this resource`,403))   

        }
        

        next()



    }
}