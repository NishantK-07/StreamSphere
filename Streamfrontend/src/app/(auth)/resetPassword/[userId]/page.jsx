"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { useParams } from 'next/navigation'
import { Label } from "@/components/Ui/label";
import { Input } from "@/components/Ui/input";
import React, { useState } from "react";
import { Button } from "@/components/Ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LucideLoader2 } from "lucide-react";
import axios from "axios";


// download card first

function resetPassword() {

  const router = useRouter();
  const params = useParams()
  // const { userId } = router.query;
  const {userId}=params
    
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false); // Flag to determine if OTP is sent
  

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
  console.log(userId)
  
    if (
      password.length === 0 ||
      confirmPassword.length === 0 ||
      otp.length == 0
    ) {
      toast({ title: "Please fill all fields" });
      setMessage("Please fill all fields")
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "New password and Confirm password do not match" });
      setMessage("New password and Confirm password do not match")
      setLoading(false);
      return;
    }

    try {
      const res = await axios.patch(`http://localhost:3010/api/auth/resetpassword/${userId}`, 
      {  password,confirmPassword,otp},{
        withCredentials:true
      }
      );
console.log(res)
      if (res.data.status =="sucess ") {
        toast({ title: "Password reset successfully!" });
        setMessage("Password reset successfully!" )
        router.push("/login");
      } else {
        toast({ title: "Failed to reset password. Try Again" });
        setMessage("Failed to reset password. Try Again")
      }
    } catch (err) {
      console.log(err)
      // if (err.data.message === "otp is not found or wrong") {
      //   // toast({ title: "Invalid OTP" });
      //   setMessage("Invalid OTP")
      // } else {
        // toast({ title: "Error resetting password" });
        setMessage("Error resetting password:")
        console.error("Error resetting password:", err);
      // }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <div className="h-screen flex items-center justify-center">
  <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle className="text-xl">
        Reset Password
      </CardTitle>
      <CardDescription>
        Enter the OTP and new password details below to reset your password.
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4">
      {/* OTP Field */}
      <div className="grid gap-2">
        <Label htmlFor="otp">Enter OTP</Label>
        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      </div>

      {/* New Password Field */}
      <div className="grid gap-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Confirm New Password Field */}
      <div className="grid gap-2">
        <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
    </CardContent>
    <CardFooter className="flex justify-end mt-4">
      <Button type="submit" onClick={handleResetPassword}>
        Submit
        {loading && (
          <LucideLoader2 className="animate-spin ml-2 w-4 h-4" />
        )}
      </Button>
    </CardFooter>
    {message && <p className="text-center mt-2">{message}</p>}
  </Card>
</div>


      {/* <Dialog open={showDialog} onOpenChange={() => setShowDialog(false)}>
        <DialogOverlay>
          <DialogContent className="p-4 bg-black rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            <div className="grid gap-4">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <Label htmlFor="password">New Password</Label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button type="submit" onClick={handleResetPassword}>
                Submit
                {loading && (
                  <LucideLoader2 className="animate-spin ml-2 w-4 h-4" />
                )}
              </Button>
            </div>
            {message && <p>{message}</p>}
          </DialogContent>
        </DialogOverlay>
      </Dialog> */}
    </>
  )
}

export default resetPassword
