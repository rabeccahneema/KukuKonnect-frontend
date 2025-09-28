"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useVerifyOtp from "../hooks/useVerifyOtp";
import Image from "next/image";

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

const Otp_length = 4;

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState<string[]>(Array(Otp_length).fill(""));
  const [message, setMessage] = useState("");
  const { verify, loading } = useVerifyOtp();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setMessage("");

    if (value && index < Otp_length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");

    const code = otp.join("");
    if (code.length < Otp_length) {
      setMessage("Please enter the 4-digit code");
      return;
    }

    try {
      const email = localStorage.getItem("forgotPasswordEmail");
      if (!email) {
        setMessage("No email found. Please restart the process.");
        return;
      }

      const result = await verify(email, code);

      if (result?.message?.toLowerCase().includes("successful")) {
        setMessage(result.message || "Verification successful.");
        setTimeout(() => {
          router.push("/reset-password");
        }, 1000);
      } else {
        setMessage(
          result?.message || result?.error || "OTP verification failed."
        );
      }
    } catch (err: any) {
      setMessage(err.message || "OTP verification failed.");
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white pl-6 sm:pl-10 lg:pl-12 pr-0 py-6 sm:py-10 lg:py-12">
      <section className="relative flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 xl:ml-32">
        <div className="max-w-xl">
          <div className="mb-8" />
          <Logo />
          <h1 className="text-[#1c4f46] text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[0.12em]">
            OTP Verification
          </h1>
          <p className="mt-6 text-center md:text-left text-[#1c4f46]/80">
            Please enter the 4 digit code that has been sent to your email
            address.
          </p>

          <form onSubmit={handleVerify} className="mt-8">
            <div className="flex items-center gap-4 justify-start flex-row">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputsRef.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-[#f1dcc7] text-2xl font-bold text-[#1c4f46] text-center focus:outline-none focus:ring-4 focus:ring-[#d89243]/30"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            {message && (
              <p
                className={`mt-4 text-sm font-medium px-3 py-2 rounded-md ${
                  message.toLowerCase().includes("success")
                    ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                    : "text-red-600 bg-red-50 border border-red-200"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full h-16 rounded-xl bg-[#d89243] text-white text-xl font-semibold shadow-[0_6px_18px_rgba(216,146,67,0.25)] transition hover:bg-[#bf7730] hover:shadow-[0_8px_22px_rgba(191,119,48,0.3)] cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#d89243]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </section>

      <section className="relative lg:block bg-[#fbe7d3] h-screen sticky top-0 mt-[-10px] xl:mt-[-50px]">
        <div className="relative w-full h-full">
          <Image
            src="/images/egg.png"
            alt="Chick on an egg"
            fill
            className="object-contain p-10"
          />
        </div>
      </section>
    </main>
  );
}
