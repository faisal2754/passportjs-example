import { useMutation, useQuery } from "@tanstack/react-query";
import { type NextPage } from "next";
import Head from "next/head";
import { AxiosError } from "axios";

import { useUserStore } from "@/store/user";
import { axiosInstance } from "@/utils/axios";

type TUserResponse = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  type: string;
};

const Protected: NextPage = () => {
  const userStore = useUserStore();

  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        "/refresh",
        {},
        { withCredentials: true }
      );

      return res.data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    isLoading,
    isError,
    error,
    data: user,
  } = useQuery<TUserResponse, AxiosError>({
    queryKey: ["user"],
    queryFn: async () => {
      let res;
      try {
        res = await axiosInstance.get("/me", {
          headers: {
            Authorization: `Bearer ${userStore.accessToken}`,
          },
        });
      } catch (err) {
        console.log("Error");
        refreshTokenMutation.mutate();
      }

      console.log(res?.data.user);

      return res!.data.user;
    },
  });

  return (
    <>
      <Head>
        <title>Passport Example</title>
        <meta name="description" content="Passport Example" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <h1 className="absolute top-16 mb-4 text-4xl">Passport Example 👀</h1>
        {isLoading && <div>Loading...</div>}
        {isError && <div>Something went wrong :(</div>}
        {user && <div>Hi {user.firstName}!</div>}
      </main>
    </>
  );
};

export default Protected;
