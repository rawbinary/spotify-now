import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";

import { getServerAuthSession } from "../../server/auth";
import { useSession } from "next-auth/react";

const Activation: NextPage = () => {
  const session = useSession();
  return (
    <main className="mt-10 transition-all duration-100">
      <div className="mt-1 border-b-2 border-zinc-800">
        <div className="container  mx-auto flex items-center justify-between pl-4 pr-4 pb-3 md:pl-0 md:pr-0">
          <h1 className="text-2xl ">Spotify Whitelist</h1>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center pt-10 transition-all duration-100">
        <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-zinc-800 p-4 hover:shadow-lg">
          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-400 sm:text-[2rem]">
            Spotify Whitelist
          </h1>
          <h3 className="text-2xl text-white">
            You are not yet whitelisted to use the app.
          </h3>
          <span>Please wait until you&apos;re whitelisted. </span>
          <span>
            Also, make sure that your spotify account has following email.
          </span>
          <input
            type="text"
            readOnly
            value={session.data?.user?.email || "Not available"}
            className="mt-1 w-full rounded-md bg-zinc-700 px-4 py-2 text-white focus:border-none"
          />
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  if (session.user.activated === true) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Activation;
