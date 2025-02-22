"use client";

import React from "react";
import { Button } from "./button";
import { PlusIcon } from "lucide-react";
import { toast } from "./use-toast";
import { useSelector } from "react-redux";
import axios from "axios";
const WishlistButton = ({ wishlist }) => {
  const user = useSelector((state) => state.userstate);
  console.log(user)
  if (!user.isLoggedIn) return <></>;
  const addToWishList = async () => {
    try {
      const res = await axios.post(`http://localhost:3010/api/user/wishlist`, wishlist,{withCredentials:true});
      if (res.data) {
        toast({
          title: "Added to Wishlist!",
        });
      }
    } catch (er) {
      console.log(er);
    }
  };
  return (
    <Button className="sm:ml-auto" onClick={addToWishList}>
      <PlusIcon className="w-4 h-4 mr-2" />
      Watchlist
    </Button>
  );
};

export default WishlistButton;