const express=require("express")
//this part is for authController
const {signuphandler,loginhandler,protecdrouteMiddleware,profilehandler,logouthandler,forgethandler,resethandler}=require("../controller/AuthController")


const AuthRouter=express.Router();
// app.post("/api/auth/login",loginhandler);
// app.post("/api/auth/signup",signuphandler);
// app.use(protecdrouteMiddleware)
// //profile ke aage protecdroute lga h jo ki ek middleware hai
// app.get("/profile",profilehandler)
// app.get("/logout",logouthandler)
// app.patch("/api/auth/forgetpassword",forgethandler)
// app.patch("/api/auth/resetpassword/:userId",resethandler)

AuthRouter.post("/login",loginhandler);
AuthRouter.post("/signup",signuphandler);
// AuthRouter.use(protecdrouteMiddleware)
//profile ke aage protecdroute lga h jo ki ek middleware hai
AuthRouter.get("/profile",profilehandler)
AuthRouter.post("/logout",logouthandler)
// AuthRouter.patch("/api/auth/forgetpassword",forgethandler)
// AuthRouter.patch("/api/auth/resetpassword/:userId",resethandler)

module.exports= AuthRouter