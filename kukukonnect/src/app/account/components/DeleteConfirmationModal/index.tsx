'use client';

import React from "react";

interface DeleteConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export default function DeleteConfirmationModal({
  show,
  onClose,
  onConfirm,
  loading,
  error,
  success
}: DeleteConfirmationModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/80 z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm text-center transition-all duration-300 ease-out transform scale-95 opacity-100">
        <h3 className="font-bold text-xl sm:text-2xl text-red-600 mb-4 text-center">
          Are you sure you want to delete your account?
        </h3>
        <p className="text-sm sm:text-base text-[#0B2C27] mb-6">This action cannot be undone.</p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-4">
          <button
            className="flex-1 py-2 sm:py-2.5 rounded-lg border-2 border-[#D2914A] text-[#0B2C27] font-semibold hover:bg-[#F5F0E6] transition-colors duration-200 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2 sm:py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200 cursor-pointer"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
        {(error || success) && (
          <p className={`text-center mt-4 text-sm sm:text-base ${error ? 'text-red-600' : 'text-green-600'}`}>
            {error || "Account deleted successfully!"}
          </p>
        )}
      </div>
    </div>
  );
}

