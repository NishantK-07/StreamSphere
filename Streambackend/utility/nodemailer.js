const dotenv= require("dotenv");
const nodemailer= require("nodemailer")
dotenv.config();


    const techDetails={
        host:"smtp.sendgrid.net",
        port:445,
        secure:true,
        auth:{
            user:"apikey",
            pass:process.env.SENDGRID_KEY
        }
    }
    const msg={
        to: 'jasbir.singh19906@gmail.com',
    from: 'jasbir.singh@scaler.com', // Change to your verified sender
    subject: 'Sending First Email',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    const transporter= nodemailer.createTransport(techDetails);
    transporter.sendMail(msg).then(()=>{
        console.log("mail sent");
    })
    .catch((error)=>{
        console.log(error)
    })

