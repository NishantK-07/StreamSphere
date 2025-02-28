const mongoose =require("mongoose");
const cors = require('cors');
const express=require("express");

const morgan=require("morgan")
const app= express();


const dotenv=require("dotenv")
dotenv.config();
const dblink=`mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.xznlp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dblink).then(function(connection){
        console.log("connected sucesfully to db ")
    }).catch(err=>{
        console.log(err)
    })


app.use(express.json());
const cookieparser=require("cookie-parser")
app.use(cookieparser())
app.use(morgan("dev"));


const corsConfig = {
  origin: true, // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization','X-Requested-With','X-HTTP-Method-Override','Accept'], // Allowed headers
  credentials:true
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));


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

const StreamRouter = require("./router/StreamRouter");
app.use("/api/video",StreamRouter)


app.listen(3010,function(){
    console.log("server listening")
})