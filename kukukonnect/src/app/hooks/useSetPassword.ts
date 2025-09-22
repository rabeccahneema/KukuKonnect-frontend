import { useState } from "react";
import { setPassword } from "../utils/fetchSetPassword";

const useSetPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updatePassword = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await setPassword(email, password);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { updatePassword, loading, error, success };
};

export default useSetPassword;