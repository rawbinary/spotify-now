import { api } from "../../utils/api";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";

export default function SourceLink(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { data, isError, isLoading, refetch } =
    api.spotify.getSongByID.useQuery({
      lid: props.lid,
    });

  if (isLoading) return "Loading...";

  const fetcher = setInterval(() => void refetch(), 5000);

  if (isError) {
    clearInterval(fetcher);
    return "Error Occurred!";
  }
  return (
    <>
      <h1>{data}</h1>
    </>
  );
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  let lid = ctx.query.linkId;
  if (Array.isArray(lid)) {
    lid = lid.pop();
  }
  console.log("LID", lid);
  if (!lid)
    return {
      notFound: true,
    };

  return {
    props: { lid },
  };
};
