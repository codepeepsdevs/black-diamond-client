"use client";
import { useGetUser } from "@/api/user/user.queries";
import Loading from "@/app/loading";
import useUserStore from "@/store/user.store";
import { useEffect, useState } from "react";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useUserStore((state) => state.setUser);
  const setIsPending = useUserStore((state) => state.setIsPending);

  const { data, isError, isPending } = useGetUser();

  useEffect(() => {
    setUser(data?.data || null);
  }, [data, isError, setUser]);

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default UserProvider;
