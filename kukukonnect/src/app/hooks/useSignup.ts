"use client";
import { useState } from "react";
import { fetchRegister } from "../utils/signUpUtils";

const useRegister = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const register = async (
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    user_type: string,
    password: string,
    image: any = null
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRegister(
        username,
        first_name,
        last_name,
        email,
        phone_number,
        user_type,
        password,
        image
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
  return { register, loading, error };
};
export default useRegister;
