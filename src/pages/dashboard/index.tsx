import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";

import DashboardLayout from "../../layout/dashboard";
import { getServerAuthSession } from "../../server/auth";
import { api } from "../../utils/api";
import { signIn, useSession } from "next-auth/react";
import Button from "../../components/Button";

const Dashboard: NextPage = () => {
  const { data: spotifyUser } = api.spotify.getCurrentUser.useQuery();
  const { data: session } = useSession();
  const { data: currSong } = api.spotify.getCurrentSong.useQuery();
  return (
    <DashboardLayout>
      <main className="flex flex-col items-center justify-center pt-10 transition-all duration-100">
        <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-zinc-800 p-4 hover:shadow-lg">
          {spotifyUser && (
            <>
              <h3 className="text-2xl text-violet-400">
                Hi, {session?.user?.name}!
              </h3>
              <h1 className="text-5xl font-extrabold tracking-tight text-green-400 sm:text-[2rem]">
                Now Playing
              </h1>
              <h3 className="text-2xl text-white">{currSong}</h3>
            </>
          )}
          {!spotifyUser && (
            <>
              <h3 className="text-xl text-green-200">
                Not authorized to access Spotify.
              </h3>
              <Button onClick={() => void signIn("spotify")}>
                Authorize Spotify Access
              </Button>
            </>
          )}
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
