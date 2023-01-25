import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";

import DashboardLayout from "../../layout/dashboard";
import { getServerAuthSession } from "../../server/auth";

const Dashboard: NextPage = () => {
  return <DashboardLayout>This is Dashboard</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default Dashboard;
