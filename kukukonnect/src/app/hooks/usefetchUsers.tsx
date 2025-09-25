"use client";
import { useEffect, useState, useCallback } from "react";
import { fetchUsers } from "../utils/fetchUsers";
import { UserType } from "../utils/types/users";

const useFetchUsers = () => {
  const [users, setUsers] = useState<Array<UserType>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await fetchUsers();
      setUsers(users);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { users, loading, error, refetch: fetchData };
};

export default useFetchUsers;











