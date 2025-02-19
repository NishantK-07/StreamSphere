const mongoose =require("mongoose");
const bcrypt=require('bcryptjs')
const wishlistItemSchema = new mongoose.Schema({
    poster_path: { type: String, required: true },
    name: { type: String, required: true },
    id: { type: String, required: true },
    media_type: { type: String, required: true },
});
const Schemarules={
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minLenght:[10,"legth should be atleast 10"],// [] make this to show your own error
    },
    confirmPassword:{
        type:String,
        required:true,
        // custom validation
        // [] make this to show your own error
        validate: [function(){
            return this.password==this.confirmPassword;
        },"password should be equal to confirmpassword"]
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    isPremium:{
        type:Boolean,
        default:false,
    },
    role:{
        type:String,
        enum:["user","admin","curator"],
        default:"user",
    },
    otp:{
        type:String,
    },
    otpExpiry:{
        type:Date
    },
    wishlist: [wishlistItemSchema],
}


const UserSchema = new mongoose.Schema(Schemarules)


UserSchema.pre("save", async function(next){
    const user = this;
    const password = user.password;
    const confirmPassword = user.confirmPassword;
    if (password == confirmPassword) {
        delete user.confirmPassword
        user.password = await bcrypt.hash(password, 10);
    } else {
        const err = new Error("Password and confirmPassword are not the same ")
        next(err)
    }
})

// // schema-> structure and validation 
// UserSchema.pre("save", function (next) {
//     const user = this;
//     if (user.role) {
//         const isValid = validCategories.includes(user.role);
//         if (isValid) {
//             next();
//         } else {
//             return next(err);
//         }
//     } else {
//         user.role = "user";
//         next();
//     }

// })
// UserSchema.post("save",function(){
//     this.__v=undefined;
//     // this.password=undefined;
    
// })
const UserModel= mongoose.model("User",UserSchema);

module.exports= UserModel;