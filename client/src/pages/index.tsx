import { type NextPage } from "next";
import Head from "next/head";
import { FormEvent } from "react";
import { toast } from "react-hot-toast";

const Home: NextPage = () => {
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast("Logging in...");
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
              <label htmlFor="email">Email</label>
              <input
                className="rounded-md p-2 text-black"
                type="text"
                id="email"
              />
            </fieldset>
            <fieldset className="mb-2 flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                className="rounded-md p-2 text-black"
                type="password"
                id="password"
              />
            </fieldset>
            <button
              className="mx-auto mt-2 w-full rounded-md bg-slate-300 p-2 px-4 font-bold text-black"
              type="submit"
            >
              Login
            </button>
          </form>
          <a className="mt-4 underline" href="/sign-up">
            Sign up instead
          </a>
        </div>
      </main>
    </>
  );
};

export default Home;
