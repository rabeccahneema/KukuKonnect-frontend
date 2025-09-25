'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";

interface ProfileFormProps {
  user: any;
  onSave: (form: any, file: File | null) => Promise<void>;
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
    deviceId: user?.device_id || '',
    profileImage: user?.image || '',
  });
  const [originalProfileData, setOriginalProfileData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phoneNumber: user?.phone_number || '',
    username: user?.username || '',
    deviceId: user?.device_id || '',
    profileImage: user?.image || '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(user?.image || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const newProfileData = {
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phoneNumber: user.phone_number || '',
        username: user.username || '',
        deviceId: user.device_id || '', 
        profileImage: user.image || '',
      };
      setProfileData(newProfileData);
      setOriginalProfileData(newProfileData);
      setPreview(user.image || '');
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileObj = e.target.files[0];
      setFile(fileObj);
      setPreview(URL.createObjectURL(fileObj));
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setIsEditing(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData(originalProfileData);
    setFile(null);
    setPreview(originalProfileData.profileImage || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(profileData, file);
  };

  const getInputClass = (isDisabled: boolean) => 
    `w-full border rounded-lg px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0 transition-colors duration-200 ${
      isDisabled
        ? 'border-[#D2914A]/30 bg-gray-50 cursor-not-allowed'
        : 'border-[#D2914A]/50 hover:border-[#D2914A]/70'
    } focus:border-2 focus:border-[#D2914A]`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 lg:p-12 w-full flex-grow flex flex-col justify-between min-h-screen lg:min-h-[700px]">
      <form className="flex flex-col h-full justify-between" onSubmit={handleSubmit}>
        <div className="border-b border-[#D2914A] pb-4 sm:pb-6 md:pb-8 mb-6 sm:mb-8 md:mb-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 relative">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36">
              <div className="absolute inset-0 rounded-full overflow-hidden shadow-md ring-4 ring-[#D2914A] ring-offset-1 sm:ring-offset-2 cursor-pointer" onClick={handleImageClick}>
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                />
              </div>

              <div 
                className="absolute -bottom-1 -right-1 sm:bottom-0 sm:right-0 bg-white rounded-full p-1 shadow-md sm:p-1.5 cursor-pointer z-20"
                onClick={(e) => {
                  handleImageClick();
                }}
              >
                <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-[#D2914A]" />
              </div>
            </div>

            <div className="text-center sm:text-left mt-4 sm:mt-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#0B2C27] mb-2">Profile Photo</h2>
              <button
                type="button"
                onClick={handleEditClick}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-[#D2914A] cursor-pointer text-white font-semibold rounded-lg shadow-lg hover:bg-[#B87E40] transition-colors duration-200 text-sm sm:text-base" >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-x-12 md:gap-y-8 flex-grow">
          <div>
            <label htmlFor="firstName" className="block text-sm sm:text-base font-semibold text-[#0B2C27] mb-2">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className={getInputClass(!isEditing)}
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
              className={getInputClass(!isEditing)}
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
              className={getInputClass(!isEditing)}
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
              className={getInputClass(!isEditing)}
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
              className={getInputClass(!isEditing)}
            />
          </div>
          {user?.user_type === "Farmer" && (
            <div>
              <label htmlFor="deviceId" className="block text-sm sm:text-base font-semibold text-[#0B2C27] mb-2">
                Device ID
              </label>
              <input
                type="text"
                id="deviceId"
                value={profileData.deviceId} 
                disabled
                className="w-full border border-[#D2914A]/50 rounded-lg px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base bg-gray-50 cursor-not-allowed"
              />
            </div>
          )}
        </div>

        {error && <div className="text-center text-red-600 py-2 text-sm sm:text-base">{error}</div>}
        
        <div className="h-10 flex items-center justify-center sm:justify-end mt-6 sm:mt-8 md:mt-10">
          {isEditing && (
            <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 sm:px-6 sm:py-3 w-full sm:w-auto bg-white text-[#0B2C27] cursor-pointer border-2 border-[#D2914A] rounded-lg font-semibold hover:bg-[#F5F0E6] transition-colors duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 sm:px-6 sm:py-3 w-full sm:w-auto cursor-pointer bg-[#D2914A] text-white rounded-lg font-semibold hover:bg-[#B87E40] transition-colors duration-200 text-sm sm:text-base"
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