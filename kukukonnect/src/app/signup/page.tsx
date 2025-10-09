"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useRegister from "../hooks/useSignup";

export default function SignUp() {
  const router = useRouter();
  const { register, loading } = useRegister();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });

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

    const { firstName, lastName, username, email, phone, password, confirm } =
      formData;

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const result = await register(
        username,
        firstName,
        lastName,
        email,
        phone,
        "Agrovet",
        password
      );
      if (
        result &&
        result.message &&
        result.message.toLowerCase().includes("successful")
      ) {
        setSuccess(result.message || "Account created successfully.");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else if (result && result.message) {
        setError(result.message);
        setSuccess(null);
      } else if (result && typeof result === "object") {
        setError(result.detail || result.error || JSON.stringify(result))
        setError(result.detail || result.error || JSON.stringify(result));
        setSuccess(null);
      } else {
        setError("Registration failed. Please try again.");
        setSuccess(null);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Registration failed. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <main
      className={[
        "min-h-screen grid bg-white pt-10",
        "grid-cols-1 lg:grid-cols-2",
      ].join(" ")}
    >
      <section className="relative flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 xl:ml-32">
        <div className="max-w-xl">
          <div className="-mt-12">
            <h1 className="mt-2 text-5xl sm:text-6xl font-bold leading-tight text-[#1c4f46]">
              Sign Up
            </h1>
            <form onSubmit={onSubmit} className="mt-5 space-y-4.5">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-base font-semibold text-[#1c4f46]"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-2 w-full h-12 rounded-lg border border-[#d89243] px-4 text-[#1c4f46] placeholder:italic placeholder:text-[#1c4f46]/60 focus:outline-none focus:ring-4 focus:ring-[#d89243]/20"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-base font-semibold text-[#1c4f46]"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-2 w-full h-12 rounded-lg border border-[#d89243] px-4 text-[#1c4f46] placeholder:italic placeholder:text-[#1c4f46]/60 focus:outline-none focus:ring-4 focus:ring-[#d89243]/20"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-base font-semibold text-[#1c4f46]"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-2 w-full h-12 rounded-lg border border-[#d89243] px-4 text-[#1c4f46] placeholder:italic placeholder:text-[#1c4f46]/60 focus:outline-none focus:ring-4 focus:ring-[#d89243]/20"
                  required
                />
              </div>
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
                  htmlFor="phone"
                  className="block text-base font-semibold text-[#1c4f46]"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
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
                    placeholder="New password"
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
                <div style={{ minHeight: 10 }}></div>
              </div>
              <div>
                <label
                  htmlFor="confirm"
                  className="block text-base font-semibold text-[#1c4f46]"
                >
                  Confirm Password
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
                <div style={{ minHeight: 0 }}></div>
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
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
              <div className="text-sm text-[#1c4f46]/70">
                <span>Already have an account? </span>
                <Link
                  href="/login"
                  className="text-[#1c4f46] font-semibold underline-offset-2 hover:underline"
                >
                  Log in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section className="relative hidden lg:block bg-[#fbe7d3] -mt-10">
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
