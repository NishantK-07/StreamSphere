"use client"
import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import SpecialOfferCard from "@/components/Ui/Specialoffercard"
import { toast } from "@/components/Ui/use-toast"
import { LucideLoader2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import {useRazorpay} from "react-razorpay"
import axios from "axios"
import { updateUserPremium } from "@/Redux/UserSlice"

const offers = [
  {
    title: "Premium Monthly",
    features: [
      "Ad-Free (except sports & live)",
      "Includes all Premium content",
      "Any 1 device at a time (up to Asli 4K quality)",
      "Download and watch anytime"
    ],
    price: "29",
    originalPrice: "59",
    discountLabel: "51% OFF",
    duration: "1 Month"
  },
  {
    title: "Family",
    features: ["Enjoy all Premium plan benefits on up to 4 devices"],
    price: "89",
    originalPrice: "149",
    discountLabel: "40% OFF",
    duration: "1 Month"
  }
]

const SubscriptionPage = props => {
  const [activePrice, setActivePrice] = useState("");
  const [loading, setLoading] = useState(false)
  const userData = useSelector(state => state.userstate)
  const dispatch = useDispatch()
  const router = useRouter()

  const {Razorpay} = useRazorpay()

  const handlePaymentClick = async () => {
    setLoading(true)
    if (activePrice === "") {
      toast({
        title: "Select a card to join premium"
      })
      setLoading(false)
      return
    }
    if(!userData){
      toast({
        title:"Please login first"
      })
      setLoading(false);
      return;
    }
    try {
      if (!userData.isLoggedIn) {
        toast({ title: "Login to get premium" })
        setLoading(false)
        router.push("/login")
      }
      const res = await axios.post(`http://localhost:3010/api/payment/order`, {
        email: userData.user?.email,
        amount: activePrice
      })
      const finalOrderObject = {
        // key: process.env.RAZORPAY_PUBLIC_KEY,
        key:'rzp_test_YNfp72fG61VC4N',
        amount: res.data.amount,
        currency: "INR",
        name: "StreamSphere Corp",
        description: "Test StreamSphere Transaction",
        order_id: res.data.orderId,
        handler: async function(response) {
          toast({ title: `Payment Successfull ${response.razorpay_order_id}` })
          try {
            const updatePremium = await axios.patch(`http://localhost:3010/api/payment/update-premium-access`, {
              email: userData.user?.email
            })
            if (updatePremium.status === 200) {
              dispatch(updateUserPremium(true))
              toast({ title: "Premium access updated successfully" })
            }
          } catch (err) {
            console.error(err)
          }
        },
        "prefill": {
          "name": "Nishant",
          "email": "Jasbir@example.com",
          "contact": "9000090000"
        },"theme": {
          "color": "#3399cc"
        }
      }
      const rzp1 = new Razorpay(finalOrderObject)
      rzp1.open()
      rzp1.on("payment.failed", function(response) {
        toast({ title: response.error.reason })
      })
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="h-screen mt-[74px] w-full">
      <Image
        src="/motu-patlu.png"
        alt="Background Image"
        fill={true}
        quality={100}
        className="-z-50 hidden md:block object-fit"
      />

      <div className="mx-auto p-4 md:pt-8 pt-4">
        <div className="flex items-center justify-between md:mb-8 ">
          <Link
            href="/"
            className=" hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            ←
          </Link>
        </div>

        <Image
          src="/motu-patlu.png"
          alt="Background Image"
          className="w-full md:hidden rounded-lg mb-4 h-[100px] object-fit"
          width={354}
          height={60}
        />

        <div className="md:mx-16">
          <h1 className="md:text-4xl text-2xl  leading-none font-black md:text-12 mb-4 text-nowrap">
            StreamSphere Premium
          </h1>
          <p className="text-lg mb-8 w-[70%] text-wrap hidden md:block">
            Entertainment Redefined - The best of Hollywood, Before TV
            premieres, Blockbuster movies, Exclusive series, India{`'`}s biggest
            Kids & Family hub + 365 days of reality!
          </p>
          <div className="flex flex-col md:flex-row w-full md:gap-8 gap-2">
            {offers.map((offer, index) => (
              <SpecialOfferCard
                key={index}
                title={offer.title}
                features={offer.features}
                price={offer.price}
                originalPrice={offer.originalPrice}
                discountLabel={offer.discountLabel}
                duration={offer.duration}
                isActive={activePrice === offer.price}
                onClick={() => setActivePrice(offer.price)}
              />
            ))}
          </div>
          <button
            className="bg-pink-600 p-3 md:mt-10 item-start flex font-medium rounded-lg ml-2"
            onClick={handlePaymentClick}
          >
            Continue & Pay
            {loading && <LucideLoader2 className="animate-spin ml-2 w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPage