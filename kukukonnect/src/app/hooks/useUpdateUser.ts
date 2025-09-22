import { useState } from "react";
import { updateUser } from "../utils/fetchUpdateProfile";
import { UserType } from "../utils/types/user";


const useUpdateUser = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const update = async (userId: number, userData: Partial<UserType>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUser(userId, userData);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error, success };
};

export default useUpdateUser;