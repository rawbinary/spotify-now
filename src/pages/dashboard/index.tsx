import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";

import DashboardLayout from "../../layout/dashboard";
import { getServerAuthSession } from "../../server/auth";

const Dashboard: NextPage = () => {
  return (
    <DashboardLayout>
      <main className="flex flex-col items-center justify-center pt-10 transition-all duration-100">
        <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-zinc-800 p-4 hover:shadow-lg">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[2rem]">
            Now Playing
          </h1>
          <h3 className="text-2xl text-white">
            Sign In to show your currently playing song on spotify
          </h3>
        </div>
      </main>
    </DashboardLayout>
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

  if (session.user.activated !== true) {
    return {
      redirect: {
        destination: "/activation",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default Dashboard;
