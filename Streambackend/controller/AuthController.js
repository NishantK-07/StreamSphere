const UserModel=require("../models/Usermodel")
const jwt=require("jsonwebtoken")
//make a callback function convert in promise
const util= require("util");
const promisify=util.promisify;
const promisedjwtsign=promisify(jwt.sign)
const promisedjwtverify=promisify(jwt.verify)

//if user already exists in database
async function signuphandler(req,res) {
    try {
        
        const userobj= req.body;
        if(!userobj.email || !userobj.password){
            return res.status(400).json({
                message:"required data missing",
                status:"failure"
            })
        }

        const user = await UserModel.findOne({email:userobj.email});
        if(user){
            return res.status(400).json({
                message:"user is already loggedin",
                status:"failure"
            })
        }
        //if user doies not exist then add user in db then create token 
        const newuser=await UserModel.create(userobj);
        console.log(newuser)
        const authToken=await promisedjwtsign({id:newuser["_id"]},process.env.SECRET_KEY)
        res.cookie("jwt",authToken,{
            maxAge:1000*60*60*24,
            httpOnly:true,
            path: "/" 
        })
        res.status(201).json({
            message:"user signedup sucessfully",
            user:newuser,
            status:"success"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status:"failure n signuphandler"
        })
    }
}
async function loginhandler(req,res){
    try {
        const {email,password}=req.body;
        const user=await UserModel.findOne({email});
        console.log(user)
        if(!user){
            return res.status(404).json({
                message:"invalid email or password",
                status:"failure"
            })
        }
        if(password!=user.password){
            return res.status(404).json({
                message:"invalid email or password",
                status:"failure"
            })
        }
        console.log(user["_id"]);
        const authToken=await promisedjwtsign({id:user["_id"]},process.env.SECRET_KEY);
        console.log("login ke time generated token",authToken)
        res.cookie("jwt",authToken,{
            maxAge:1000*60*60*24,
            httpOnly:true,
            path: "/" 
        })
        res.status(200).json({
            message:"logined succesfully",
            status:"success",
            user: {
                _id: user._id,     // Return userId here
                name: user.name,
                email: user.email,
                isPremium: user.isPremium,  // You can send other fields as needed
              },
           
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status:"failure in loginhandler"
        })
    }
}

async function protecdrouteMiddleware(req,res,next) {
    try {
        const authtoken=req.cookies;
        console.log(authtoken)
        const token=authtoken.jwt;
        console.log("tera token",token)
        if(!token){
            return res.status(404).json({
                message:"unauthorised access of token",
                status:"failure"
            })
        }
      
        const decrypttoken=await promisedjwtverify(token,process.env.SECRET_KEY);
        req.userId=decrypttoken.id;
        next();
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status:"failure in catch protected route"
        })
    }
}
async function profilehandler(req,res) {
    try {
        const userid=res.id;
        const user= await UserModel.findOne(userid);
        if(!user){
            return res.status(404).json({
                message:"user not found",
                status:"failure"
            })
        }
        res.json({
            message:"profile worked",
            status:"success",
            user:user
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status:"failure"
        })
    }
}

async function logouthandler(req,res) {
    try {
        res.clearCookie('jwt',{path:"/"});
        res.json({
            message:"logout successfullu",
            status:"success"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status:"failure"
        })
    }
}

//otp generator function
const otpgenerator=()=>{
    return Math.floor((Math.random()*10000)+90000);
}
async function forgethandler(req,res) {
    try {
        //agar mail nhi dala user ne to 
        if(req.body.email==undefined){
            return res.status(401).json({
                status:"failure",
                message:"please enter a valid email"
            })
        }
        const {email}=req.body;
        //agar user nhi mila to 
        const user= await UserModel.findOne({email: email})
        if(user==null){
            return res.status(401).json({
                status:"failure",
                message:"user not found for this email"
            })
        }
        if(user.otp!=undefined || user.otpExpiry!=undefined){
            user.otp=undefined;
            user.otpExpiry=undefined;
        }
        
        //otp bnao and database me save karo
        const otp= otpgenerator();
        
        user.otp=otp;
        user.otpExpiry=Date.now()+1000*60*10;
        await user.save({validateBeforeSave:false});

        //now try to send email for otp
      console.log(user)
        res.status(200).json({
            message:"otp sent succesfully",
            status:"sucess",
            otp:otp,
            // reseturl:`http:loaclhost:3000/auth/resetPassword/${user["_id"]}`
            userId:user._id
        })
    } catch (error) {
        console.log("error in forgothandler",error)
        res.status(500).json({
            message: error.message,
            status:"failure"
        })
    }
}
async function resethandler(req,res) {
    try {
        //agar body me ye sab nhi h to wapas bhejo
        // let resetdetails= req.body;
        let resetdetails= req.body;
        if(!resetdetails.password || !resetdetails.otp || !resetdetails.confirmPassword || resetdetails.password!==resetdetails.confirmPassword){
           return  res.status(401).json({
                status:"failure",
                message:"invalid request in resetdeatlas"
            })
        }
        const userId= req.params.userId;
        const user=await UserModel.findById(userId)
        //if user not found
        console.log(user)
        if(user==null){
            return res.status(401).json({
                status:"failure",
                message:"user not found"
            })
        }
        //agar db me otp present nhi h 
        if(user.otp==undefined){
            return res.status(401).json({
                status:"failure",
                message:"unauthorized access to reset password"
            })
        }
        //if otp expired
        if(Date.now()>user.otpExpiry){
            return res.status(401).json({
                status:"failure",
                message:"otp expired"
            })
        }
        //if otp is incorrect
        if(user.otp!=resetdetails.otp){
            return res.status(401).json({
                status:"failure",
                message:"incorrect otp "
            })
        }

        user.password= resetdetails.password;
        user.confirmPassword=resetdetails.confirmPassword;
        user.otp=undefined;
        user.otpExpiry=undefined;
        await user.save();
        console.log(user)
        return res.status(200).json({
            status:"sucess ",
            message:"password reset successfull",
            user:user
        })
      
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status:"failure"
        })
    }
}
module.exports={
    signuphandler,loginhandler,protecdrouteMiddleware,profilehandler,logouthandler,forgethandler,resethandler
}