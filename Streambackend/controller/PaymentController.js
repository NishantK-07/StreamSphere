const Razorpay=require("razorpay");
const UserModel = require("../models/Usermodel");
const {PORT,RAZORPAY_PUBLIC_KEY, RAZORPAY_PRIVATE_KEY}=process.env
//create instance 
const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_PUBLIC_KEY,
    key_secret: RAZORPAY_PRIVATE_KEY
})

const getPaymentController=async (req,res)=>{
    try {
        const amount = 100;
        const currency = "INR";
        const receipt = `RECIPT_ID`;

        const orderConfig = {
            amount: amount * req.body.amount,
            currency: currency,
            receipt: +receipt+Date.now()
        }
        const order = await razorpayInstance.orders.create(orderConfig);
        // console.log("order", order);
        res.status(201).json({
            status: "success",
            order: order
        })
    } catch (err) {
        // console.log("err", err);
        res.status(500).json({
            status: "failure",
            message: err.message
        })
    }
}

const updatePremiumAccessController = async (req, res) => {
    try {
      const email = req.body.email;
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.premiumAccess = true;
      await UserModel.findOneAndUpdate(
        { email: email },
        { $set: { isPremium: true } },
        { new: true }
      );
      res.json({ message: { isPremium: true } });
    } catch (err) {
      // console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  module.exports = {
    getPaymentController,
    updatePremiumAccessController,
  };