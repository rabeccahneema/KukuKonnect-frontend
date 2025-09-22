// src/app/account/components/ProfileForm.tsx
'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ProfileFormProps {
  user: any;
  onSave: (form: any) => Promise<void>;
  saving: boolean;
  error: string | null;
  onSuccess: () => void;
}

export default function ProfileForm({ user, onSave, saving, error, onSuccess }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phoneNumber: user?.phone_number || '',
    username: user?.username || '',
    deviceId: user?.mcu_device_id || '',
    profileImage: user?.image || '', // ✅ Always use user's image — no hardcoded fallback
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phoneNumber: user.phone_number || '',
        username: user.username || '',
        deviceId: user.mcu_device_id || '',
        profileImage: user.image || '', // ✅ Always sync with user data
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(profileData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 w-full flex-grow flex flex-col justify-between"
      style={{ minHeight: '700px', maxHeight: '700px' }} // ✅ Fixed height — no scrolling
    >
      <form className="flex flex-col h-full" onSubmit={handleSubmit}>
        <div className="flex-grow flex flex-col">
          {/* ✅ Image always visible — treated like other fields */}
          <div className="mb-6 sm:mb-8 md:mb-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-md ring-4 ring-[#D2914A] ring-offset-2">
                <img
                  src={profileData.profileImage || "https://via.placeholder.com/150"} // ✅ Only fallback if truly empty
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B2C27] mb-2">Profile Photo</h2>
                <div className="mt-4">
                  <label htmlFor="profileImage" className="block text-sm sm:text-base font-semibold text-[#0B2C27] mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="profileImage"
                    name="profileImage"
                    value={profileData.profileImage}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full border border-[#D2914A]/50 rounded-lg px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0 focus:border-2 focus:border-[#D2914A] transition-colors duration-200 ${
                      isEditing
                        ? 'border-2 border-[#D2914A]'
                        : 'border-[#D2914A]/50 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-x-12 md:gap-y-8 flex-grow">
            <div>
              <label htmlFor="firstName" className="block text-sm sm:text-base font-semibold text-[#0B2C27] mb-2">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border border-[#D2914A]/50 rounded-lg px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0 focus:border-2 focus:border-[#D2914A] transition-colors duration-200 ${
                  isEditing
                    ? 'border-2 border-[#D2914A]'
                    : 'border-[#D2914A]/50 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm sm:text-base font-semibold text-[#0B2C27] mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border border-[#D2914A]/50 rounded-lg px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0 focus:border-2 focus:border-[#D2914A] transition-colors duration-200 ${
                  isEditing
                    ? 'border-2 border-[#D2914A]'
                    : 'border-[#D2914A]/50 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm sm:text-base font-semibold text-[#0B2C27] mb-2">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border border-[#D2914A]/50 rounded-lg px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0 focus:border-2 focus:border-[#D2914A] transition-colors duration-200 ${
                  isEditing
                    ? 'border-2 border-[#D2914A]'
                    : 'border-[#D2914A]/50 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm sm:text-base font-semibold text-[#0B2C27] mb-2">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border border-[#D2914A]/50 rounded-lg px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0 focus:border-2 focus:border-[#D2914A] transition-colors duration-200 ${
                  isEditing
                    ? 'border-2 border-[#D2914A]'
                    : 'border-[#D2914A]/50 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm sm:text-base font-semibold text-[#0B2C27] mb-2">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border border-[#D2914A]/50 rounded-lg px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0 focus:border-2 focus:border-[#D2914A] transition-colors duration-200 ${
                  isEditing
                    ? 'border-2 border-[#D2914A]'
                    : 'border-[#D2914A]/50 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>
            <div>
              <label htmlFor="deviceId" className="block text-sm sm:text-base font-semibold text-[#0B2C27] mb-2">Device Id</label>
              <input
                type="text"
                id="deviceId"
                name="deviceId"
                value={profileData.deviceId}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border border-[#D2914A]/50 rounded-lg px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0 focus:border-2 focus:border-[#D2914A] transition-colors duration-200 ${
                  isEditing
                    ? 'border-2 border-[#D2914A]'
                    : 'border-[#D2914A]/50 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>
          </div>
        </div>

        {error && <div className="text-center text-red-600 py-2 text-sm sm:text-base">{error}</div>}

        <div className="mt-6 sm:mt-8 md:mt-10">
          {isEditing && (
            <div className="flex flex-col-reverse sm:flex-row justify-center sm:justify-end space-y-4 sm:space-x-4 sm:space-y-0">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 sm:px-8 sm:py-3 bg-white text-[#0B2C27] cursor-pointer border-2 border-[#D2914A] rounded-lg font-semibold hover:bg-[#F5F0E6] transition-colors duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 sm:px-8 sm:py-3 cursor-pointer bg-[#D2914A] text-white rounded-lg font-semibold hover:bg-[#B87E40] transition-colors duration-200 text-sm sm:text-base"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </form>
    </motion.div>
  );
}