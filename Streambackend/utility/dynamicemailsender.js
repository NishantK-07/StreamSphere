const dotenv= require("dotenv");
const nodemailer= require("nodemailer")
dotenv.config();
const fs= require("fs")
async function updateTemplateHelper(templatepath,totreplaceobject){
    let templatecontent= await fs.promises.readFile(templatepath,"utf-8")
    const keyarr=Object.keys(totreplaceobject);
    keyarr.forEach((key)=>{
        templatecontent=templatecontent.replace(`#{${key}}`,totreplaceobject[key]);
    })
    return templatecontent
}
async function smailsender(templatepath,receiveremail,totreplaceobject){
    try {
        const content= await updateTemplateHelper(templatepath,receiveremail,totreplaceobject);
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
            to: recieverEmail,
            from: 'jasbir.singh@scaler.com', // Change to your verified sender
            subject: 'Sending First Email',
            text: "",
            html: content,
        }
        const transporter= nodemailer.createTransport(techDetails);
        await transporter.sendMail(msg)
        console.log("email sent")
    
    } catch (error) {
        console.log("email not sent",error)
    }
    
}
const totreplaceobject={
    name:"jasibr",
    otp:"123456"
}
await smailsender("./templates/otp.html",receiveremail,totreplaceobject)
   