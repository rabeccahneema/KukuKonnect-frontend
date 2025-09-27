"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaTachometerAlt, FaHistory, FaUser, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_WIDTH_DESKTOP = "xl:w-[260px] lg:w-[200px] w-64";

interface SidebarProps {
  onLogoutClick: () => void;
}

const navItems = [
  { name: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
  { name: "History", icon: <FaHistory />, path: "/history" },
  { name: "Account", icon: <FaUser />, path: "/account" },
  { name: "Logout", icon: <FaSignOutAlt />, path: "/logout" },
];

function Sidebar({ onLogoutClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={`hidden lg:flex fixed top-0 left-0 flex-col h-screen bg-[#084236] text-white p-4 shadow-md transition-all duration-300 ${SIDEBAR_WIDTH_DESKTOP}`}
        style={{ minHeight: "100vh" }}
      >
        <div className="mb-6 flex justify-center">
          <Image src="/images/KukuLogo.png" alt="Logo" width={200} height={100} priority />
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 text-base ${
                      isActive ? "bg-[#D2914A] text-white" : "text-white hover:bg-[#D2914A]"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
          </div>
          <div className="pb-6">
            {navItems
              .filter((item) => item.name === "Logout")
              .map((item) => {
                return (
                  <button
                    key={item.name}
                    onClick={onLogoutClick}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 text-base text-white hover:bg-[#D2914A]"
                    type="button"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
          </div>
        </nav>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-[#084236] text-white flex justify-around py-2 shadow-lg ">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return item.name === "Logout" ? (
            <button
              key={item.name}
              onClick={onLogoutClick}
              className="flex flex-col items-center px-2 py-1 rounded-md transition-colors duration-200 text-xs text-white hover:bg-[#D2914A]"
              type="button"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="mt-1">{item.name}</span>
            </button>
          ) : (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center px-2 py-1 rounded-md transition-colors duration-200 text-xs ${
                isActive ? "bg-[#D2914A] text-white" : "text-white hover:bg-[#D2914A]"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function LogoutPage() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => setShowConfirm(true);
  const handleClose = () => setShowConfirm(false);
  const handleConfirmLogout = () => {
    setShowConfirm(false);
    window.location.href = "../login";
  };

  return (
    <div>
      <Sidebar onLogoutClick={handleLogoutClick} />

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
    </div>
  );
}
