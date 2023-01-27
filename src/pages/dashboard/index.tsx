import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

import DashboardLayout from "../../layout/dashboard";
import { getServerAuthSession } from "../../server/auth";
import { api } from "../../utils/api";
import { signIn } from "next-auth/react";
import Button from "../../components/Button";

const Dashboard: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const {
    data: currSong,
    isError,
    error,
  } = api.spotify.getCurrentSong.useQuery();

  const {
    data,
    error: linkError,
    refetch,
  } = api.spotify.getStreamLink.useQuery(undefined, { enabled: false });

  const copyToClipboard = async () => {
    await refetch();
    if (linkError) return alert(linkError);
    if (data) {
      await navigator.clipboard.writeText(data);
      alert("Link copied!");
    }
  };

  return (
    <DashboardLayout>
      <main className="flex flex-col items-center justify-center pt-10 transition-all duration-100">
        <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-zinc-800 p-4 hover:shadow-lg">
          {props.spotify && (
            <>
              <h3 className="text-2xl text-violet-400">Hi, {props.user}!</h3>
              <h1 className="text-5xl font-extrabold tracking-tight text-green-400 sm:text-[2rem]">
                Now Playing
              </h1>
              <h3 className="text-2xl text-white">{currSong}</h3>
              <Button onClick={() => void copyToClipboard()}>
                Get Browser Source URL
              </Button>
              <span className="text-sm">
                Careful, anyone with this link can get your spotify now playing
                status.
              </span>
            </>
          )}
          {!props.spotify && !isError && (
            <>
              <h3 className="text-xl text-green-200">
                Not authorized to access Spotify.
              </h3>
              <Button onClick={() => void signIn("spotify")}>
                Authorize Spotify Access
              </Button>
            </>
          )}
          {isError && (
            <>
              <p>
                Error Occurred, Please raise a issue at
                https://github.com/rawbinary/spotify-now:{" "}
              </p>
              <pre>{error.message}</pre>
            </>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
};

import { prisma } from "../../server/db";

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

  const accs = await prisma.account.count({
    where: { userId: session.user.id, provider: "spotify" },
  });

  return {
    props: { user: session.user.name, spotify: accs > 0 },
  };
};

export default Dashboard;
