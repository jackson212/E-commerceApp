const errorhandler=require('../utils/errorhandler')

const catchasync = require('../middleware/catchasync');

const User=require('../model/userModel')

const sendToken=require('../utils/JwtToken');
const ErrorHandler = require('../utils/errorhandler');

const sendEmail = require('../utils/sendEmail.js')

const crypto=require('crypto')




exports.register= catchasync(async(req,res,next)=>{

   const {name,email,password}=req.body;

   const user=await  User.create({

    name,email,password,
    avatar:{

        public_id:"this  is  a sample id",
        url:"profielurl"
    },
    
   });

   
   sendToken(user,200,res) 


})

exports.login =catchasync(async (req, res, next) => {
     const { email, password } = req.body;
   
     // checking if user has given password and email both
   
     if (!email || !password) {
       return next(new errorhandler("Please Enter Email & Password", 400));
     }
   
      const user= await User.findOne({email}).select("+password") 
     
     if (!user) {
       return next(new errorhandler("Invalid email or password", 401));
     }
   
     const isPasswordMatched = await user.comparepassword(password);
   
     if (!isPasswordMatched) {
       return next(new errorhandler("Invalid email or password", 401));
      }
    

     sendToken(user,200,res) 
    
   });

  exports.logout=catchasync(async(req,res,next)=>{

    res.cookie("token",null,{
     
      expires:new Date(Date.now()),
      httpOnly:true,

    })

    res.status(200).json({
    
      success : true,
      message: "Logged out"
 

    })
   })
 
   exports.forgotpassword=catchasync(async(req,res,next)=>{

      const user=await User.findOne({email:req.body.email})

      console.log("user  is ",user.name)

      if(!user){

        return  next(new ErrorHandler("user not found ",404))


      }

    const tokenReset=user.getResetPasswordToken()

    console.log("reseting token",tokenReset)
   

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/passsword/reset/${tokenReset}`;
    
    const message = `Your passwosssrd reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message
      });
    } catch (error) {

      console.log("its eror",error)
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new errorhandler(error.message, 500));
    }
    



   })


   exports.resetpassword =catchasync(async(req,res,next)=>{

   const resetpassToken=crypto.createHash("sha256")
   .update(req.params.token)
   .digest("hex");

   console.log(resetpassToken)
   const user = await User.findOne({
      
    resetPasswordToken:resetpassToken ,
    resetPasswordExpire:{$gt : Date.now()}

   });


   if(!user){
   
    return next( new errorhandler("user not found" ,404))

   }
    if(req.body.password!== req.body.confirmPassword){

    return next( new errorhandler("passpord is not mathcing" ,404))
    }


  user.password=req.body.password

  user.resetPasswordToken =undefined
  user.resetPasswordExpire=undefined

  await user.save();
  
  sendToken(user,200,res)


  })


  exports.getuserDetails=catchasync(async(req,res,next)=>{
        

  const user= await User.findById(req.user.id)
   
 res.status(200).json({

  success:true,
  user
 })  

  })


  
  exports.updatePassword=catchasync(async(req,res,next)=>{
        

    const user= await User.findById(req.user.id).select("+password")
     
    const isPasswordMatched= await user.comparepassword(req.body.oldpassword);

    if (!isPasswordMatched) {
      return next(new errorhandler("Old password is incorrect", 400));
    }
   
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new errorhandler("password does not match", 400));
    }
  
    user.password = req.body.newPassword;
  
    await user.save();
  
    sendToken(user, 200, res);
    



    
    res.status(200).json({
  
    success:true,
    user
   })  
  
    })



    exports.updateprofile=catchasync(async(req,res,next)=>{

   
      const newUserdata={

      name:req.body.name,
      email:req.body.email,
      role:req.body.role
      }


      const user = await User.findByIdAndUpdate( req.user.id,newUserdata,{

         new:true,
         runValidators:true,
         useFindAndModify:false
      })

      res.status(200).json({

        success:true,
        

      })
      })


exports.getAlluser=catchasync(async(req,res,next)=>{

   const user =await User.find();
   res.status(200).json({

      success:true,
      user

   })



})

exports.getSingleuser=catchasync(async(req,res,next)=>{

  const user =await User.findById(req.params.id);
 
   if(!user){

    return next(
      new errorhandler("usr not exist in here")
    )}

   res.status(200).json({

     success:true,
     user

  })
})

exports.updateRole=catchasync(async(req,res,next)=>{

   
  const newUserdata={


  role:req.body.role
  }


  const user = await User.findByIdAndUpdate( req.params.id,newUserdata,{

     new:true,
     runValidators:true,
     useFindAndModify:false
  })

  res.status(200).json({

    success:true,
    user
    

  })
  })

  exports.DeleteUser=catchasync(async(req,res,next)=>{

 
  
    const user = await User.findById( req.params.id)
  
    if(!user){

      new errorhandler("user not found to delete",404)
    }
    
     
    res.status(200).json({
  
      success:true,
      message:"user deleted successfully"
      
  
    })

    user.remove()
    })
  
  