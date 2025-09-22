import { useState } from "react";
import { deleteUser } from "../utils/fetchDeleteAccount";

const useDeleteUser = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const remove = async (userId: number) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await deleteUser(userId);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error, success };
};

export default useDeleteUser;