"use client";
import Image from "next/image";
import {
  FaUsers,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";


const agrovetNav = [
  { name: "Users", icon: <FaUsers />, path: "/users" },
  { name: "Account", icon: <FaUser />, path: "/account" },
  { name: "Logout", icon: <FaSignOutAlt />, path: null },
];

export default function Sidebar() {
  const navItems = agrovetNav;
  const pathname = usePathname();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => setShowConfirm(true);
  const handleClose = () => setShowConfirm(false);
  const handleConfirmLogout = () => {
    setShowConfirm(false);
    window.location.href = "/login";
  };

  return (
    <>
      <div className="fixed inset-0 w-43 overflow-hidden">
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
                .filter((item) => item.name !== "Logout" && item.path)
                .map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      href={item.path as string}
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
              <button
                key="Logout"
                onClick={handleLogoutClick}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base md:text-lg text-white hover:bg-[#D2914A]"
                type="button"
              >
                <span className="text-lg sm:text-xl"><FaSignOutAlt /></span>
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#084236] text-white flex justify-around py-2 sm:py-3 shadow-lg z-50">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            if (item.name === "Logout") {
              return (
                <button
                  key={item.name}
                  onClick={handleLogoutClick}
                  className="flex flex-col items-center px-2 py-1 rounded-md transition-colors duration-200 text-xs sm:text-sm text-white hover:bg-[#D2914A]"
                  type="button"
                >
                  <span className="text-lg sm:text-xl"><FaSignOutAlt /></span>
                  <span className="mt-1">{item.name}</span>
                </button>
              );
            }
            if (item.path) {
              return (
                <Link
                  key={item.name}
                  href={item.path as string}
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
            }
            return null;
          })}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-[400px] flex flex-col items-center relative">
            <div className="text-[#D5A14A] text-2xl font-bold mb-3 text-center">Confirm Log Out</div>
            <div className="text-gray-700 text-center mb-6">Are you sure you want to sign out?</div>
            <div className="flex gap-4">
              <button
                className="bg-[#D5A14A] text-white px-8 py-2 rounded font-semibold hover:bg-[#B88B36] transition"
                onClick={handleConfirmLogout}
                type="button"
              >
                Yes
              </button>
              <button
                className="border border-[#D5A14A] text-[#D5A14A] px-8 py-2 rounded font-semibold hover:bg-[#F5EAD7] transition text-center"
                onClick={handleClose}
                type="button"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
