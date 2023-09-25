const express =require("express")
const errorMiddleware=require("./middleware/error")
const app =express();

app.use(express.json())
app.use(errorMiddleware)
//Route
const product = require('./routers/ProductRoute')

app.use("/api/v1",product);





module.exports=app
