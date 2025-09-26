import { useEffect, useState } from "react";
import { fetchUser } from "../utils/fetchUser";
import { UserType } from "../utils/types/user";

const useFetchUser = (userId: number) => {
 const [user, setUser] = useState<UserType | null>(null);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);


 useEffect(() => {
   if (typeof window === "undefined" || !userId) {
     setLoading(false);
     return;
   }


   (async () => {
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



