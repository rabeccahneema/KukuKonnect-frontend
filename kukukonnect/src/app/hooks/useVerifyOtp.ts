"use client";
import { useState } from "react";
import { verifyOtp } from "../utils/verifyotpUtils";

const useVerifyOtp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const verify = async (
      email:string,
      Otp:string,
    ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await verifyOtp(
      email,
      Otp,
      );
      if (!result) {
        throw new Error("Registration failed");
      }
      return result;
    } catch (error) {
      setError((error as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { verify, loading, error };
};
export default useVerifyOtp;



