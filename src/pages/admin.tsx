import {InferGetServerSidePropsType, NextApiRequest, NextApiResponse} from "next";
import Layout from '@/components/layout';
import { getIronSession } from 'iron-session';
import { sessionOptions } from "@/lib/session";

export default function Admin() {
    return (
        <Layout>
            <h1>Admin</h1>
            <form method="POST" action="/api/auth/logout">
                <button>Logout</button>
            </form>
        </Layout>
    );
}

export const getServerSideProps = async function ({req, res}: { req: NextApiRequest, res: NextApiResponse }) {
    const session: any = await getIronSession(req, res, sessionOptions);
    if (!session.userId) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
};