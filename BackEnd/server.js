const app =require("./app")

const dotenv =require("dotenv");

const DBconnect=require('./config/database')
//config

dotenv.config({path:"backend/config/config.env"});

DBconnect()

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});




const server=app.listen(process.env.PORT,()=>{

  console.log(`server is working on http://localhost:${process.env.PORT}`)

})




process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});