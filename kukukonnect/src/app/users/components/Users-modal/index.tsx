'use client';
import React, { useState } from "react";

interface AddUserModalProps {
  show: boolean;
  onClose: () => void;
  onAddUser: (form: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    username: string;
    device_id: string;
    user_type: string;
  }) => Promise<void>;
}

export default function AddUserModal({ show, onClose, onAddUser }: AddUserModalProps) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    username: "",
    device_id: "",
    user_type: "Farmer"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  if (!show) return null;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccessMessage("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onAddUser(form);
      setSuccessMessage("Farmer added successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 2000); 
    } catch (err: any) {
      setError(err.message || "Failed to add farmer");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "First name", name: "first_name", placeholder: "Enter first Name", type: "text" },
    { label: "Last name", name: "last_name", placeholder: "Enter last Name", type: "text" },
    { label: "Email Address", name: "email", placeholder: "Enter Email Address", type: "email" },
    { label: "Phone Number", name: "phone_number", placeholder: "Enter Phone Number", type: "text" },
    { label: "Username", name: "username", placeholder: "Enter username", type: "text" },
    { label: "Device id", name: "device_id", placeholder: "Enter device id", type: "text" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#F9FAFB]/70"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl shadow-[0_12px_48px_0_rgba(8,66,54,0.25),0_4px_32px_0_rgba(210,145,74,0.22)] w-[90vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl py-5 px-4 sm:py-7 sm:px-8 relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-xl font-bold text-[#222] hover:text-[#D2914A] cursor-pointer"
          aria-label="Close modal"
        >
          &#10005;
        </button>

        <h2 className="text-lg font-bold mb-4 text-[#084236]">
          Add New Farmer
        </h2>

        <div className="space-y-3">
          {fields.map(field => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-[15px] font-bold text-[#084236] mb-1"
              >
                {field.label}
              </label>
              <input
                required
                id={field.name}
                name={field.name}
                type={field.type}
                value={form[field.name as keyof typeof form]}
                onChange={onChange}
                placeholder={field.placeholder}
                className="w-full border border-[#D2914A] rounded-lg px-4 py-2 mb-1 outline-none text-[#084236] text-[15px] placeholder:italic placeholder:text-[#A9A9A9] placeholder:text-[14px] focus:ring-2 focus:ring-[#D2914A] transition bg-white"
                autoComplete="off"
              />
            </div>
          ))}
        </div>

        {(error || successMessage) && (
          <div className="mt-4 mb-2 text-center">
            {error && (
              <div className="text-red-600 font-semibold">{error}</div>
            )}
            {successMessage && (
              <div className="text-green-600 font-semibold">{successMessage}</div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mt-6 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 border border-[#084236] text-[#084236] font-semibold py-2 rounded-lg hover:bg-[#e1ede5] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-1/2 bg-[#D2914A] hover:bg-[#b87b37] text-white font-semibold py-2 rounded-lg transition cursor-pointer"
          >
            {loading ? "Adding..." : "Add Farmer"}
          </button>
        </div>
      </form>
    </div>
  );
}