const express =require("express")
const errorMiddleware=require("./middleware/error")
const app =express();
const cookieparser= require('cookie-parser')

app.use(express.json())
app.use(errorMiddleware)
app.use(cookieparser())


//Route
const product = require('./routers/ProductRoute')
const user =require("./routers/UserRoutes")
const  order =require('./routers/orderRoutes')




app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);








module.exports=app
