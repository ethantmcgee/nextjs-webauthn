import Layout from '@/components/layout';
import { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from 'iron-session';
import { sessionOptions } from "@/lib/session";

export default function Register() {
    return (
        <Layout>
            <h1>Register</h1>
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
}