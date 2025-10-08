"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useResetPassword from "../hooks/useResetPassword";

function Logo() {
  return (
    <div className="flex justify-start -mt-8">
      <div className="relative w-60 h-60">
        <Image
          src="/images/Kuku-Logo.png"
          alt="Kuku Logo"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm: "",
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });
  const router = useRouter();
  const { resetPassword, loading } = useResetPassword();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [id]: value };

      if (id === "confirm" || (id === "password" && updated.confirm)) {
        if (
          updated.password &&
          updated.confirm &&
          updated.password !== updated.confirm
        ) {
          setError("Passwords do not match.");
        } else {
          setError(null);
        }
      }
      return updated;
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const { email, password, confirm } = formData;
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const result = await resetPassword(email, password);
      const extractMessage = (res: any) => {
        if (!res) return null;
        if (typeof res === "string") return res;
        if (typeof res === "object") {
          if (res.message) return res.message;
          if (res.error) return res.error;
          if (res.detail) return res.detail;
        
          const fieldKeys = Object.keys(res).filter(
            (k) => !["message", "error", "detail"].includes(k)
          );
          if (fieldKeys.length) {
            return fieldKeys
              .map((k) =>
                Array.isArray(res[k]) ? res[k].join(" ") : String(res[k])
              )
              .join(" ");
          }
        }
        return null;
      };

      const msg = extractMessage(result);
      if (
        result &&
        !result.error &&
        msg &&
        msg.toLowerCase().includes("password")
      ) {
        setSuccess(msg || "Password reset successfully");
        setTimeout(() => router.push("/login"), 1000);
        return;
      }

      if (msg) {
        setError(msg);
        setSuccess(null);
        return;
      }

      
      setError("Set password failed. Please try again.");
      setSuccess(null);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Set password failed. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <main
      className={[
        "min-h-screen grid bg-white",
        "grid-cols-1 lg:grid-cols-2",
      ].join(" ")}
    >
      <section className="relative flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 ml-32 -mt-10.5">
        <div className="max-w-xl">
          <Logo />
          <div className="-mt-12">
            <h1 className="mt-2 text-5xl sm:text-6xl font-bold leading-tight text-[#1c4f46]">
              Reset Password
            </h1>
            <form onSubmit={onSubmit} className="mt-4 space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-base font-semibold text-[#1c4f46]"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 w-full h-12 rounded-lg border border-[#d89243] px-4 text-[#1c4f46] placeholder:italic placeholder:text-[#1c4f46]/60 focus:outline-none focus:ring-4 focus:ring-[#d89243]/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-base font-semibold text-[#1c4f46]"
                >
                  Password
                </label>
                <div className="relative mt-2 flex items-center">
                  <input
                    id="password"
                    type={showPassword.password ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-12 rounded-lg border border-[#d89243] px-4 pr-12 text-[#1c4f46] placeholder:italic placeholder:text-[#1c4f46]/60 focus:outline-none focus:ring-4 focus:ring-[#d89243]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((s) => ({ ...s, password: !s.password }))
                    }
                    className="absolute inset-y-0 right-3 my-auto text-sm text-[#1c4f46]/70 hover:text-[#1c4f46] focus:outline-none"
                    aria-label={
                      showPassword.password ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword.password ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="flex justify-end mt-2"></div>
              </div>
              <div>
                <label
                  htmlFor="confirm"
                  className="block text-base font-semibold text-[#1c4f46]"
                >
                  Confirm password
                </label>
                <div className="relative mt-2 flex items-center">
                  <input
                    id="confirm"
                    type={showPassword.confirm ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirm}
                    onChange={handleChange}
                    className="w-full h-12 rounded-lg border border-[#d89243] px-4 pr-12 text-[#1c4f46] placeholder:italic placeholder:text-[#1c4f46]/60 focus:outline-none focus:ring-4 focus:ring-[#d89243]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((s) => ({ ...s, confirm: !s.confirm }))
                    }
                    className="absolute inset-y-0 right-3 my-auto text-sm text-[#1c4f46]/70 hover:text-[#1c4f46] focus:outline-none"
                    aria-label={
                      showPassword.confirm ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword.confirm ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="flex justify-end mt-2"></div>
              </div>

              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}
              {success && !error && (
                <p className="text-sm font-medium text-emerald-700">
                  {success}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-lg bg-[#d89243] text-white text-lg font-semibold shadow-[0_6px_18px_rgba(216,146,67,0.25)] transition hover:bg-[#bf7730] hover:shadow-[0_8px_22px_rgba(191,119,48,0.3)] focus:outline-none cursor-pointer focus:ring-4 focus:ring-[#d89243]/30 disabled:opacity-70"
                aria-label="Reset Password"
              >
                Reset Password
              </button>
              <div className="text-sm text-[#1c4f46]/70"></div>
            </form>
          </div>
        </div>
      </section>
      <section className="relative hidden lg:block bg-[#fbe7d3]">
        <Image
          src="/images/egg.png"
          alt="Chick on an egg"
          fill
          className="object-contain p-10"
        />
      </section>
    </main>
  );
}
