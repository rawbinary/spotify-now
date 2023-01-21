import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Spotify Now</title>
        <meta
          name="description"
          content="Spotify Now - Show current tracks on streams easily"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-10 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Spotify</span> Now
          </h1>
          <h3 className="text-2xl text-white">
            {/* Sign In to show your currently playing song on spotify */}
          </h3>
        </div>
        <div className="flex flex-col items-center gap-2">
          <AuthShowcase />
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-3xl text-slate-300">
        {sessionData && (
          <span>
            Hi, <strong>{sessionData.user?.name}</strong>!
          </span>
        )}
      </p>
      <div className="flex gap-4">
        {sessionData && (
      <Link
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        href="dashboard"
      >
        Dashboard
      </Link>
        )}
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
      </div>
    </div>
  );
};
