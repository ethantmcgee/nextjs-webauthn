import Layout from '@/components/layout';
import { sessionOptions } from "../lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";

export default function Login() {
    return (
        <Layout>
            <h1>Login</h1>
        </Layout>
    );
}

export const getServerSideProps = async function ({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    const session: any = await getIronSession(req, res, sessionOptions);
    if (!!session.userId) {
        return {
            redirect: {
                destination: "/admin",
                permanent: false,
            },
        };
    }
};