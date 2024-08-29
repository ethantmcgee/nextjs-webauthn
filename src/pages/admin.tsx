import {InferGetServerSidePropsType, NextApiRequest, NextApiResponse} from "next";
import { Fragment } from "react";
import { getIronSession } from 'iron-session';
import { sessionOptions } from "@/lib/session";

export default function Admin({
                                  userId,
                              }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <Fragment>
            <h1>Admin</h1>
            <span>User ID: {userId}</span>
            <form method="POST" action="/api/auth/logout">
                <button>Logout</button>
            </form>
        </Fragment>
    );
}

export const getServerSideProps = async function ({req, res}: { req: NextApiRequest, res: NextApiResponse }) {
    const session: any = await getIronSession(req, res, sessionOptions);
    if (!!session.userId) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return {
        props: {
            userId: session.userId ?? null,
        },
    };
};