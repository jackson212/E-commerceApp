const catchasync = require('../middleware/catchasync');
const Product =require('../model/productModel')
const errorhandler =require('../utils/errorhandler')
const ApiFeatures=require('../utils/ApiFeatures') 


exports.createProduct=  catchasync(async(req,res,next)=>{
  
  req.body.user=req.user.id
  const product=await Product.create(req.body)
  res.status(200).json({

    success:true,
    product
});
});


exports.getAllProdcuts = catchasync(async(req,res)=>{
  const perpage=5
  const countProduct= await Product.countDocuments()
  const apifeatures= new ApiFeatures(Product.find(),req.query).search().filter().pagination(perpage);
  const product =await apifeatures.query
  res.status(200).json({

    success:true,
    product,
    countProduct
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

exports.createProductReview = catchasync(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  console.log("product id" ,productId)  

  const review = {            //review data 
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating), //from  body 
    comment
  };
  console.log("is for user",req.user.id) 
  const product = await Product.findById(productId); //product

 
 
  
  const isReviewed = product.reviews.find(
   
    (rev) => rev.user.toString() === req.user._id.toString()
   
   
    );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

  

exports.deleteReview = catchasync(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
   
  console.log(product)
  if (!product) {
    return next(new errorhandler("Product not found", 404));
  }
  
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  
  
  let avg = 0;
  
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  
  let ratings = 0;
  
  if (reviews.length === 0){
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }
  const numOfReviews = reviews.length;
  
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  
  res.status(200).json({
    success: true,
  });
});
  
exports.getProductReviews = catchasync(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  
  if (!product) {
    return next(new errorhandler("Product not found", 404));
  }
  
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});