"use client";

import { getUser } from "@/api/auth/user/user";
import { useEffect } from "react";
import { userStore } from "@/store";
import Link from "next/link";

// components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Input } from "../ui/input";

// icons
import { BiSearch as SearchIcon } from "react-icons/bi";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

const Header = () => {
  const { user, login } = userStore();

  useEffect(() => {
    // TODO improve this code
    // get user
    const getData = async () => {
      const data = await getUser();
      login(data?.data);
    };

    getData();
  }, []);

  return (
    <div className="py-2 px-4 border-b w-full flex items-center justify-between">
      <Link href={"/"}>
        <Image
          src={"/logo-light.png"}
          height={60}
          width={150}
          alt="logo"
          className="h-6 w-auto object-cover"
        />
      </Link>
      <div className="relative bg-secondary w-full max-w-md px-4 py-2 rounded-full flex items-center gap-2 border border-transparent focus-within:border-foreground transition-all">
        <SearchIcon size={20} />
        <input
          placeholder="Search for videos"
          role="searchbox"
          className="bg-transparent w-full border-none outline-none text-sm"
        />
        {/* <div className="absolute translate-y-2 top-full left-0 w-full bg-secondary shadow-md rounded-md p-4 z-50">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>hello</div>
          ))}
        </div> */}
      </div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Image
              src={user?.avatar ? user.avatar.url : "/default-user.png"}
              height={70}
              width={70}
              alt={user?.fullName}
              className="h-10 w-10 aspect-square rounded-full object-cover"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          href={"/login"}
          className={buttonVariants({
            className: "rounded-lg px-6",
          })}
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default Header;
