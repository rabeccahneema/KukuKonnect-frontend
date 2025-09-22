"use client";

import { useState } from "react";
import { Login } from "../utils/loginUtils";

const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await Login(email, password);
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
  return { login, loading, error };
};
export default useLogin;
