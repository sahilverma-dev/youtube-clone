"use client";

import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { CompassIcon, Home, MenuIcon, User, User2, Video } from "lucide-react";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

// sidebar data
const sidebarData = [
  {
    title: "Home",
    route: "/",
    icon: Home,
  },
  {
    title: "Subscriptions",
    route: "/subscriptions",
    icon: Video,
  },
  {
    title: "Explore",
    route: "/explore",
    icon: CompassIcon,
  },
  {
    title: "You",
    route: "/you",
    icon: User2,
  },
];

const Sidebar = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const pathname = usePathname();

  // sidebar controls
  const openSidebar = () => setIsOpenSidebar(true);
  const closeSidebar = () => setIsOpenSidebar(false);
  const toggleSidebar = () => setIsOpenSidebar((state) => !state);

  return (
    <motion.div
      animate={{
        width: isOpenSidebar ? "250px" : "auto",
      }}
      className="border-r flex-shrink-0 h-screen p-4 flex gap-2 flex-col items-center justify-between"
    >
      <div className="flex w-full items-center justify-between">
        {isOpenSidebar && (
          <Link href={"/"}>
            <Image
              src={"/logo-light.png"}
              height={60}
              width={150}
              alt="logo"
              className="h-6 w-auto object-cover"
            />
          </Link>
        )}

        <Button variant={"ghost"} size={"icon"} onClick={toggleSidebar}>
          <MenuIcon />
        </Button>
      </div>
      <div className="flex-grow flex flex-col gap-2 w-full rounded-lg">
        {sidebarData?.map((item) => (
          <Link
            key={item.route}
            href={item.route}
            className={cn([
              buttonVariants({
                variant: pathname === item.route ? "default" : "ghost",
                size: isOpenSidebar ? "default" : "icon",
              }),
              "text-left text-xs flex items-center gap-2 w-full",
            ])}
          >
            <item.icon size={18} />
            {isOpenSidebar && <p className="flex-grow">{item.title}</p>}
          </Link>
        ))}
      </div>
      <ThemeToggle />
    </motion.div>
  );
};

export default Sidebar;
