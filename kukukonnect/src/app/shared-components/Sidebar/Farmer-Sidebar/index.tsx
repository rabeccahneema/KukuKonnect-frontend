"use client";
import Image from "next/image";
import {
  FaTachometerAlt,
  FaHistory,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const farmerNav = [
  { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
  { name: "History", icon: <FaHistory />, path: "/history" },
  { name: "Account", icon: <FaUser />, path: "/account" },
  { name: "Logout", icon: <FaSignOutAlt />, path: "/logout" },
];
export default function Sidebar() {
  const navItems = farmerNav;
  const pathname = usePathname();
  return (
    <>
      <div className="fixed inset-0 overflow-hidden">
        <div className="hidden lg:flex fixed top-0 left-0 flex-col w-64 bg-[#084236] text-white h-screen p-4">
          <div className="Logo mb-6 flex justify-center">
            <Image
              src="/images/KukuLogo.png"
              alt="Logo"
              width={200}
              height={100}
              priority
            />
          </div>
          <nav className="flex flex-col justify-between h-full">
            <div className="flex flex-col space-y-4">
              {navItems
                .filter((item) => item.name !== "Logout")
                .map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base md:text-lg ${
                        isActive
                          ? "bg-[#D2914A] text-white"
                          : "text-white hover:bg-[#D2914A]"
                      }`}
                    >
                      <span className="text-lg sm:text-xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
            </div>
            <div className="pb-6">
              {navItems
                .filter((item) => item.name === "Logout")
                .map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base md:text-lg ${
                        isActive
                          ? "bg-[#D2914A] text-white"
                          : "text-white hover:bg-[#D2914A]"
                      }`}
                    >
                      <span className="text-lg sm:text-xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
            </div>
          </nav>
        </div>
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#084236] text-white flex justify-around py-2 sm:py-3 shadow-lg z-50">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex flex-col items-center px-2 py-1 rounded-md transition-colors duration-200 text-xs sm:text-sm ${
                  isActive
                    ? "bg-[#D2914A] text-white"
                    : "text-white hover:bg-[#D2914A]"
                }`}
              >
                <span className="text-lg sm:text-xl">{item.icon}</span>
                <span className="mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
