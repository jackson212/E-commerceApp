const Product =require('../model/productModel')
const errorhandler =require('../utils/errorhandler')
const catchasync=require('../middleware/catchasync')

exports.createProduct=  async(req,res,next)=>{

  const product=await Product.create(req.body)
  res.status(200).json({

    success:true,
    product
});
};


exports.getAllProdcuts = catchasync(async(req,res)=>{

 const product =await Product.find()
    res.status(200).json({

    success:true,
    product
})



});
exports.ProductDetail= catchasync(async(req,res,next)=>{

  let product = await Product.findById(req.params.id)
  if(!product){

   return next(new errorhandler("oh product cannot found",404))
   
    // return res.status(500).json({
      //     success:false,
      //     message:"product not .............. found.............."
      // })
  }


  res.status(500).json({
    success:true,
    product

  })

})




exports.updateProduct=catchasync( async(req,res,next)=>{

    let product = await Product.findById(req.params.id)
    if(!product){

        return res.status(500).json({
            success:false,
            message:"product not .............. found.............."
        })
    };

   product=await Product.findByIdAndUpdate(req.params.id,req.body,{

        new:true,
        runValidators:true,
        useFindAndModify:false
    
    })
  

  res.status(500).json({
    success:true,
    product

  })

});

exports.deleteProduct=catchasync(async(req,res,next)=>{

   const product =await Product.findById(req.params.id)

   if(!product){

    return res.status(500).json({
        success:false,
        message:"product not found"
    })
  }

   await product.deleteOne()

   res.status(500).json({
    success:true,
    product,
    message:"Product is removed"

  })


})