const mongoose =require("mongoose");
const cors = require('cors');
const express=require("express");
const app= express();

//allow api calls from frontend
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials:true
  }));

const dotenv=require("dotenv")
dotenv.config();
const dblink=`mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.xznlp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dblink).then(function(connection){
        console.log("connected sucesfully to db ")
    }).catch(err=>{
        console.log(err)
    })

// const UserModel= require("./Models/Express/Usermodel")
// const usercontrollerobj=require("./userController")
// or
app.use(express.json());
const cookieparser=require("cookie-parser")
app.use(cookieparser())


// const {createuser,getalluser,getuserbyid,deleteuser}=require("./Controller/userController")
// //this part is for userController
// app.post("/user",createuser)
// app.get("/user",getalluser)
// app.get("/user/:id",getuserbyid)
// app.delete("/user/:id",deleteuser)



const AuthRouter=require("./router/AuthRouter")
app.use("/api/auth",AuthRouter)

const MovieRouter=require("./router/MovieRouter")
app.use("/api/movies",MovieRouter)


const DiscoverRouter = require("./router/DiscoverRouter");
app.use("/api/discover", DiscoverRouter);

const TvShowsRouter = require("./router/TvRouter");
app.use("/api/tv", TvShowsRouter);

const PaymentRouter = require("./router/PaymentRouter");
app.use("/api/payment", PaymentRouter);

const UserRouter = require("./router/UserRouter");
app.use("/api/user", UserRouter);

app.listen(3010,function(){
    console.log("server listening")
})