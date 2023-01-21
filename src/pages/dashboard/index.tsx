import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import AccessDenied from "../../components/AccessDenied";

const Dashboard: NextPage = () => {
    const { data: session } = useSession()

    if (!session) {
        return <AccessDenied/>
    }
    return <>This is Dashboard</>
}

export default Dashboard