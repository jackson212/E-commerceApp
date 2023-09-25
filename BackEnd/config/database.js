const mongoose = require('mongoose');


const DBconnect=async()=>{

   try {
    mongoose.set("strictQuery",false)
       const  conn = await  mongoose.connect(process.env.MONGOURL,{

        useNewUrlParser: true,
        useUnifiedTopology: true,
      
       

       })
      
       console.log(`Mongodb connected ${conn.connection.host}`)

   } catch (error) {
      
    console.log(`connection errror ${error.message}`)

    process.exit(1)


   }

}

module.exports=DBconnect