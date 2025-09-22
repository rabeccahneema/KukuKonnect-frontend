'use client';

import React, { useState, useEffect } from "react";
import useFetchUser from "../hooks/useFetchUser";
import useUpdateUser from "../hooks/useUpdateUser";
import useDeleteUser from "../hooks/useDeleteUser";
import useSetPassword from "../hooks/useSetPassword";
import { useRouter } from "next/navigation";
import AccountNav from "./components/AccountNav";
import ProfileForm from "./components/ProfileForm";
import ChangePasswordForm from "./components/ChangePasswordForm";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const getUserId = () => {
  return 3; 
};

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState('edit-profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPwdSuccessPopup, setShowPwdSuccessPopup] = useState(false); 
  const router = useRouter();

  const userId = getUserId();
  if (!userId) {
    router.push("/login");
    return null;
  }

  const { user, loading, error } = useFetchUser(userId);
  const { update, loading: editSaving, error: editError, success: editSuccess } = useUpdateUser();
  const { remove, loading: deleteLoading, error: deleteError, success: deleteSuccess } = useDeleteUser();
  const { updatePassword, loading: pwdLoading, error: pwdError, success: pwdSuccess } = useSetPassword();

  useEffect(() => {
    if (editSuccess) {
      setShowSuccessPopup(true);
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [editSuccess]);

  useEffect(() => {
    if (pwdSuccess) {
      setShowPwdSuccessPopup(true);
      const timer = setTimeout(() => {
        setShowPwdSuccessPopup(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [pwdSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [deleteSuccess, router]);

  const handleSave = async (form: any) => { // ✅ Removed file parameter
    if (!userId || !user) return;

    const userData = {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone_number: form.phoneNumber,
      username: form.username,
      mcu_device_id: form.deviceId,
      user_type: user.user_type,
      image: form.profileImage, // ✅ Send image URL
    };

    await update(userId, userData);
  };

  const handleDeleteAccount = async () => {
    await remove(userId);
  };

  return (
    <div className="flex-1 flex flex-col p-12 bg-gray-100 items-center">
      <h1 className="text-2xl sm:text-4xl self-start font-extrabold text-[#0B2C27] mb-8 ml-[5%]">Account Settings</h1>

      <AccountNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowDeleteConfirm={setShowDeleteConfirm}
      />

      <div className="flex-grow flex items-center justify-center overflow-y-auto w-[90%]">
        {loading ? (
          <div className="text-center text-xl text-[#0B2C27]">Loading...</div>
        ) : error ? (
          <div className="text-center text-xl text-red-700">{error}</div>
        ) : activeTab === 'edit-profile' ? (
          <ProfileForm
            user={user}
            onSave={handleSave} // ✅ No file parameter
            saving={editSaving}
            error={editError}
            onSuccess={() => {}} 
          />
        ) : activeTab === 'change-password' ? (
          <ChangePasswordForm
            email={user?.email || ""}
            onCancel={() => setActiveTab('edit-profile')}
            updatePassword={updatePassword}
            loading={pwdLoading}
            error={pwdError}
            onSuccess={() => {}} 
          />
        ) : null}
      </div>

      <DeleteConfirmationModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        loading={deleteLoading}
        error={deleteError}
        success={deleteSuccess}
      />

      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm mx-4"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#0B2C27] mb-2">Success!</h3>
            <p className="text-[#0B2C27]">Profile updated successfully.</p>
          </motion.div>
        </div>
      )}

      {showPwdSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm mx-4"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#0B2C27] mb-2">Success!</h3>
            <p className="text-[#0B2C27]">Password changed successfully.</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}