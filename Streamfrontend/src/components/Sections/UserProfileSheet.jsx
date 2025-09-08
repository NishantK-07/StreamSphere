"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/Ui/sheet";
import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navLinks } from "./Header";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOutDetails } from "@/Redux/UserSlice";
import { toast } from "sonner";
import axios from "axios";

const UserProfileSheet = () => {
    // const { toast } = useToast()
  const path = usePathname();
  const activeTabKey = path.split("/")?.[1];
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const userData = useSelector((state) => state.userstate);
console.log(userData)

  const handleClick = async () => {
    try {
      const res = await axios.post(`http://localhost:3010/api/auth/logout`,{},{
        withCredentials:true
      });
      console.log(res)
      console.log("response of logout",res)
      if (res.data.status === "success") {
        dispatch(userLoggedOutDetails());
        router.push("/");
        toast.success("Logout Successfull")
      }
    } catch (err) {
      console.log("err in logout: ", err);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
         {!userData.isLoggedIn ? (
          <Image
            src="/profile.avif"
            alt="Profile Icon"
            className="ml-4 h-10 w-10 rounded-full"
            width={40}
            height={40}
          />
        ) : ( 
          <div className="ml-4 h-10 w-10 rounded-full bg-[#0059A3] text-xl font-semibold flex items-center justify-center">
            {userData.user ? userData?.user?.user?.name.charAt(0).toUpperCase() : ""}
          </div>
        )}  
      </SheetTrigger>
      <SheetContent side={"right"} className="px-6">
        <div className="bg-slate-700/30 p-6 flex flex-col items-center gap-2 mt-[100px] rounded-lg">
           {!userData.isLoggedIn ? (
            <Image
              src="/profile.avif"
              alt="Profile Icon"
              className="h-[100px] w-[100px] rounded-full -mt-[60px]"
              width={40}
              height={40}
            />
          ) : (
            <div className="relative h-[100px] w-[100px] rounded-full -mt-[60px] bg-[#0059A3] text-3xl font-bold flex items-center justify-center">
              {userData.user ? userData?.user?.user?.name.charAt(0).toUpperCase() : ""}
            </div>
          )} 
          <p className="text-xl font-bold capitalize">
            {userData.isLoggedIn ? userData.user?.name : "Guest"}
          </p>
          {!userData.isLoggedIn ? (
            <Link
              href={"/login"}
              className="rounded-full font-medium mt-4 text-base px-4 py-2 bg-pink-600"
              onClick={() => {
                setOpen(false);
              }}
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                href="/resetPassword"
                className="text-gray-500 hover:text-pink-500 hover:underline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Reset Password
              </Link>
              <button
                className="rounded-full font-medium mt-4 text-base px-4 py-2 bg-pink-600"
                onClick={handleClick}
              >
                Logout
              </button>
            </>
          )}
          
        </div>
        <div className="divide-y my-4">
          <Link href={"/subscription"} className="flex items-center justify-between px-2 py-4 text-sm"
            onClick={() => {
              setOpen(false);
            }}>
            Subscribe Now
            <ChevronRightIcon className="w-6 h-6" />
          </Link>
          <div>
            {navLinks.map((link) => (
              <Link href={link.href} key={link.key} className={`flex items-center justify-between px-2 py-4 text-sm ${
                activeTabKey === link.key
                  ? "border-b-2 border-pink-500 text-white"
                  : ""
              }`}
                onClick={() => {
                  setOpen(false);
                }}
              >
                {link.name}
                <ExternalLinkIcon className="w-4 h-4" />
              </Link>
            ))}
          </div>
          <Link href={"/"} className="flex items-center justify-between px-2 py-4 text-sm">
            Help and Legal
            <ChevronRightIcon className="w-6 h-6" />
          </Link>
        </div>
      </SheetContent>

    </Sheet>
    
  );
};

export default UserProfileSheet;