"use client";
import { useState } from "react";
import { ForgotPassword } from "../utils/forgotpasswordUtils";


const useForgotPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ForgotPassword(email);
      if (!result) {
        throw new Error("Login failed");
      }
      return result;
    } catch (error) {
      setError((error as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { forgotPassword, loading, error };
};
export default useForgotPassword;

