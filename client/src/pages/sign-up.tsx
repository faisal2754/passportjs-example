import { type NextPage } from "next";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

import { axiosInstance } from "@/utils/axios";
import { useUserStore } from "@/store/user";
import { useMutation } from "@tanstack/react-query";

type TSignUpResponse = {
  accessToken: string;
};

type TSignUpBody = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
};

const SignUp: NextPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const userStore = useUserStore((state) => state);

  const signUpMutation = useMutation({
    mutationFn: async (body: TSignUpBody) => {
      const res = await axiosInstance.post<TSignUpResponse>("/signup", body, {
        withCredentials: true,
      });
      return res.data;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      console.log(data.accessToken);
      userStore.setAccessToken(data.accessToken);
      toast.success("Signed up!");
      router.push("/protected");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong :(");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUpMutation.mutate({
      firstName,
      lastName,
      phone,
      email,
      password,
    });
  };

  return (
    <>
      <Head>
        <title>Passport Example</title>
        <meta name="description" content="Passport Example" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <h1 className="absolute top-16 mb-4 text-4xl">Passport Example 👀</h1>
        <div className="flex flex-col items-center">
          <form onSubmit={handleLogin}>
            <fieldset className="mb-2 flex flex-col">
              <label htmlFor="firstName">First Name</label>
              <input
                className="rounded-md p-2 text-black"
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </fieldset>
            <fieldset className="mb-2 flex flex-col">
              <label htmlFor="lastName">Last Name</label>
              <input
                className="rounded-md p-2 text-black"
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </fieldset>
            <fieldset className="mb-2 flex flex-col">
              <label htmlFor="phone">Phone Number</label>
              <input
                className="rounded-md p-2 text-black"
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </fieldset>
            <fieldset className="mb-2 flex flex-col">
              <label htmlFor="email">Email Address</label>
              <input
                className="rounded-md p-2 text-black"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </fieldset>
            <fieldset className="mb-2 flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                className="rounded-md p-2 text-black"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>
            <button
              className="mx-auto mt-2 w-full rounded-md bg-slate-300 p-2 px-4 font-bold text-black"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "..." : "Sign Up"}
            </button>
          </form>
          <a className="mt-4 underline" href="/">
            Login instead
          </a>
        </div>
      </main>
    </>
  );
};

export default SignUp;
