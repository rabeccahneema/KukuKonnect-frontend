'use client';

import React from "react";

interface TabButtonProps {
  tab: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton = ({ tab, label, isActive, onClick }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`
      cursor-pointer
      relative 
      px-8 py-4 
      text-xl 
      transition-colors duration-200 
      ${isActive
        ? 'bg-white text-[#0B2C27] font-semibold border-b-4 border-[#0B2C27]'
        : 'bg-transparent text-gray-600 hover:bg-gray-200 border-b-4 border-transparent border-opacity-10'
      }

      flex-1 
      text-sm 
      p-2 
      whitespace-nowrap 
      overflow-hidden 
      sm:flex-none 
      sm:text-base 
      sm:p-4 
      md:text-lg md:p-4 
      lg:text-xl lg:p-4
    `}
  >
    {label}
  </button>
);

interface AccountNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowDeleteConfirm: (show: boolean) => void;
}

export default function AccountNav({ activeTab, setActiveTab, setShowDeleteConfirm }: AccountNavProps) {
  return (
    <div className="
      flex 
      space-x-2 
      mb-8 
      border-b border-[#D2914A] 
      flex-col 
      sm:flex-row 
      space-y-2 
      sm:space-y-0 
      sm:space-x-2 
      md:space-x-2
      sm:mb-8 
      w-full 
      sm:w-[90%]
    ">
      <TabButton
        tab="edit-profile"
        label="Edit Profile"
        isActive={activeTab === 'edit-profile'}
        onClick={() => setActiveTab('edit-profile')}
      />
      <TabButton
        tab="change-password"
        label="Change Password"
        isActive={activeTab === 'change-password'}
        onClick={() => setActiveTab('change-password')}
      />
      <TabButton
        tab="delete-account"
        label="Delete Account"
        isActive={activeTab === 'delete-account'}
        onClick={() => setShowDeleteConfirm(true)}
      />
    </div>
  );
}

