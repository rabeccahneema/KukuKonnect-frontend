'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface ChangePasswordFormProps {
  email: string;
  onCancel: () => void;
  setPasswordFn: (email: string, newPassword: string) => Promise<any>;
  loading: boolean;
  error: string | null;
  onSuccess: () => void;
}

export default function ChangePasswordForm({
  email,
  onCancel,
  setPasswordFn,
  loading,
  error,
  onSuccess,
}: ChangePasswordFormProps) {
  const [form, setForm] = useState({ email, newPassword: '', confirmPassword: '' });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setLocalError(null);

    if (name === 'confirmPassword') {
      if (value && value !== form.newPassword) {
        setPasswordMismatch(true);
      } else {
        setPasswordMismatch(false);
      }
    }
  };

  useEffect(() => {
    if (form.confirmPassword && form.newPassword !== form.confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  }, [form.newPassword, form.confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!form.email) {
      setLocalError('Email is required.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setLocalError('New passwords do not match.');
      return;
    }

    try {
      const result = await setPasswordFn(form.email, form.newPassword);
      if (result) {
        onSuccess();
      }
    } catch (err) {
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-12 2xl:p-12 w-full h-full min-h-[700px] flex flex-col justify-between"
    >
      <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between">
        <div className="flex-grow flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl 2xl:text-4xl font-bold text-[#0B2C27] mb-6 sm:mb-8 md:mb-10 lg:mb-10 2xl:mb-10 text-center">
            Change Password
          </h2>
          <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-10 2xl:space-y-10 w-full max-w-xl">
            <div className="relative">
              <label htmlFor="email" className="block text-sm sm:text-base md:text-base lg:text-base 2xl:text-base font-semibold text-[#0B2C27] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-[#D2914A]/50 rounded-lg px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0 focus:border-2 focus:border-[#D2914A] transition-colors duration-200"
                autoComplete="email"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="newPassword" className="block text-sm sm:text-base md:text-base lg:text-base 2xl:text-base font-semibold text-[#0B2C27] mb-2">
                New Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full border border-[#D2914A]/50 rounded-lg px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0 focus:border-2 focus:border-[#D2914A] transition-colors duration-200"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 inset-y-0 flex items-center text-[#0B2C27] hover:text-[#D2914A] transition p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showNewPassword ? <Eye size={22} /> : <EyeOff size={22} />}
                </button>
              </div>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm sm:text-base md:text-base lg:text-base 2xl:text-base font-semibold text-[#0B2C27] mb-2">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-[#D2914A]/50 rounded-lg px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-0 focus:border-2 focus:border-[#D2914A] transition-colors duration-200"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 inset-y-0 flex items-center text-[#0B2C27] hover:text-[#D2914A] transition p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <Eye size={22} /> : <EyeOff size={22} />}
                </button>
              </div>
            </div>

            {(localError || passwordMismatch) && (
              <p className="text-center text-sm sm:text-base text-red-600">
                {localError || 'Passwords do not match.'}
              </p>
            )}
            {error && <p className="text-center text-sm sm:text-base text-red-600">{error}</p>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-4 sm:space-x-4 sm:space-y-0 mt-6 sm:mt-8 md:mt-10">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 sm:px-8 py-2 sm:py-3 cursor-pointer bg-white text-[#0B2C27] border-2 border-[#D2914A] rounded-lg font-semibold hover:bg-[#F5F0E6] transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-[#D2914A] text-white rounded-lg cursor-pointer font-semibold hover:bg-[#B87E40] transition-colors duration-200"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}