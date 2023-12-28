const mongoose = require('mongoose');


const DBconnect=()=>{

   
    
         mongoose.connect(process.env.MONGOURL,{

        useNewUrlParser: true,
        useUnifiedTopology: true,
      
      
      }).then((data)=>{
         console.log(`Mongodb connected ${data.connection.host}`)})  
     
         }


module.exports=DBconnect