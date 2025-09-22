import { useEffect, useState } from "react";
import { fetchUser } from "../utils/fetchUser";
import { UserType } from "../utils/types/user";

const useFetchUser = (userId: number) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjo0OTEyMTQ0MzcyLCJpYXQiOjE3NTg1NDQzNzIsImp0aSI6IjM4MzE2ZDMwZWNhNzQ3YTA4MDA2MDgwZjk1MTUzYjc2IiwidXNlcl9pZCI6M30.FrWDaCSwCfuGBLNlu7PRvL76zsMRPFI_4EIqNdcjuc4";
      
      localStorage.setItem("token", Token);

      try {
        const userData = await fetchUser(userId);
        setUser(userData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  return { user, loading, error };
};

export default useFetchUser;