"use client";

import { useState } from "react";
import { resetPassword } from "../utils/resetpasswordUtils";

const useResetPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const ResetPassword = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await resetPassword(email, password);
      return result;
    } catch (error) {
      setError((error as Error).message);
      return { error: (error as Error).message };
    } finally {
      setLoading(false);
    }
  };
  return { resetPassword: ResetPassword, loading, error };
};
export default useResetPassword;
