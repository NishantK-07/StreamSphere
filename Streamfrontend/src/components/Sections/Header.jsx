"use client";


import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserProfileSheet from "./UserProfileSheet";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedInDetails } from "@/Redux/UserSlice";
export const navLinks = [
  { name: "Home", key: "", href: "/" },
  { name: "Movies", key: "movies", href: "/movies" },
  { name: "Tv Shows", key: "tv", href: "/tv" },
  { name: "Watchlist", key: "watchlist", href: "/watchlist" },
  { name: "Stream+", key: "Stream+", href: "/stream+" },
];
const Header = () => {
  const path = usePathname();
  const activeTabKey = path.split("/")?.[1];
  const userData = useSelector((state) => state.userstate);

  return (
    <div className="bg-[#0d0e10] py-4 w-full fixed top-0 z-50  border-b-2 border-b-grey">
      <div className="lg:mx-auto mx-2 lg:px-4 flex items-center text-nowrap">
        <div className="flex items-center">
          <Link href="/">
           StreamSphere
            
          </Link>
          <Link
            href="/subscription"
            className="ml-4 mr-4 md:px-4 px-4 py-1 font-large rounded-3xl flex items-center gap-2 text-[#c1a362] border-[#c1a362] border text-sm md:text-base"
          >
            <Image src="/crown.svg" height={16} width={16} alt="crown" />
            <span className="pr-4">
              {userData?.user?.isPremium ? "" : "Go "}Premium
            </span>
          </Link>
        </div>
        <nav className="lg:flex lg:space-x-4 space-x-0 hidden">
          {navLinks.map((tab) => (
            <Link
              href={tab.href}
              key={tab.key}
              className={`px-1 py-2 font-medium text-[#b6b8b8] hover:text-white ${
                activeTabKey === tab.key
                  ? "border-b-2 border-pink-500 text-white"
                  : ""
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end w-full">
          <div className="rounded-3xl border lg:flex justify-center items-center px-4 gap-2 hidden">
            <Image src="/search.svg" alt="search icon" height={20} width={20} />
            <input
              type="text"
              placeholder="Search..."
              className=" py-2 bg-transparent  text-white font-medium focus:outline-none text-sm max-w-[150px]"
            />
          </div>
          <UserProfileSheet />
        </div>
      </div>
    </div>
  );
};

export default Header;