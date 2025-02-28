'use client'
import React, { useState } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser'
// import { useNavigate } from 'react-router-dom';
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Ui/use-toast";
import { LucideLoader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
function forgetpassword(){
    const { toast } = useToast();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

  
const handleForgotPassword=async (e)=>{
    e.preventDefault();
    try {
        const response = await axios.patch('http://localhost:3010/api/auth/forgetpassword', { email });
        console.log("yha ka error----------",response)
        if (response.data.status === "sucess") {
            // toast({ title: "OTP sent successfully!" });
            setMessage(response.data.message);
            setOtp(response.data.otp); 

            sendotp(response.data.otp);
            router.push(`/resetPassword/${response.data.userId}`);
        } else {
            toast({ title: "Failed to send OTP. Try Again" });
            console.log("message for otpsent",message)
        }
    } catch (error) {
        if (error.response?.data?.message === "no user with this email id found") {
            toast({ title: "Email doesn't exist" });
          } else {
            toast({ title: "Error sending OTP" });
            console.error("Error sending OTP at last:", error);
          }
    }
    finally {
        setLoading(false);
      }
}


const sendotp = (otp) => {
  // e.preventDefault();

  // Replace these with your EmailJS credentials
  const serviceID = process.env.SERVICEID; // Service ID (e.g., Gmail)
  const templateID = process.env.TEMPLATEID; // Template ID
  const userID = process.env.USERID; // User ID from your EmailJS account

  const templatedata={
    from_name:name,
    form_email:email,
    to_name:"aiworld",
    message:`your otp to reset password is : ${otp}`
  }
  // Send the email
  emailjs
    .send(serviceID, templateID, templatedata, userID)
    .then(
      (response) => {
        console.log('Email sent successfully:', response);
        setStatusMessage('Your message has been sent!');
      },
      (error) => {
        console.error('Failed to send email:', error);
        setStatusMessage('There was an error sending your message.');
      }
    );

  // Clear the form data after submission
 
};
    return (
        <>
            <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">
              Forgot Password / Reset Password
            </CardTitle>
            <CardDescription>
              Enter your email below to get OTP.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button className="mt-6" onClick={handleForgotPassword}>
                Send OTP
                {loading && (
                  <LucideLoader2 className="animate-spin ml-2 w-4 h-4" />
                )}
              </Button>
            </div>
            {message && <p>{message}</p>}
          </CardContent>
        </Card>
      </div>
        </>
    )
}

export default forgetpassword