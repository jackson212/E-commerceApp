const Order=require('../model/orderModel')
const product =require('../model/productModel')
const errorhandler=require('../utils/errorhandler')
const catchasync =require('../middleware/Catchasync')



exports.newOrder=catchasync(async(req,res)=>{

  
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsprice,
        taxPrice,
        shippingPrice,
        totalPrice
    
    }=req.body

    const order= await Order.create({

        shippingInfo,
        orderItems,
        paymentInfo,
        itemsprice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user:req.user._id,
    })


 res.status(201).json({

    success:true,
    order
})
 
})


exports.getSingleOrder=catchasync(async(req,res,next)=>{
    console.log(req.params.id)
   const order=await Order.findById(req.params.id).populate("user","name email")
   
    
    
    if(!order){

        return next(new errorhandler("order not found",401))
    }


    res.status(200).json({
     success:true,
     order

    })



})

exports.Orders=catchasync(async(req,res,next)=>{

    const orders =await Order.find({user:req.user._id})
        
     


    res.status(200).json({
     success:true,
     orders

    })



})


exports.getAllOrders = catchasync(async (req, res, next) => {
    const orders = await Order.find();
  
    let totalAmount = 0;
  
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
  
    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  });


exports.updateOrder = catchasync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    console.log(order)
  
    if (!order) {
      return next(new errorhandler("Order not found with this Id", 404));
    }
  
    if (order.orderStatus === "Delivered") {
      return next(new errorhandler("You have already delivered this order", 400));
    }
  
    if(req.body.status === "Shipped") {
        console.log("its shipped")
      order.orderItems.forEach(async (ord) => {
        await updateStock(ord.product, ord.quantity);
      });
    }
    order.orderStatus = req.body.status;
    
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
    
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message:"chceck"
    });
  });
  
  async function updateStock(id, quantity) {
    const Product = await product.findById(id);

    console.log(Product)
  
    Product.Stock -= quantity;
  
    await Product.save({ validateBeforeSave: false });
  }
  
  // delete Order -- Admin
  exports.deleteOrder = catchasync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new errorhandler("Order not found with this Id", 404));
    }
  
    await order.remove();
  
    res.status(200).json({
      success: true,
    });
  });