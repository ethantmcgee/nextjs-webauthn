import { sessionOptions } from '@/lib/session';
import { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { Box, Card } from '@mui/material';
import Layout from '@/app/layout';
import UsernamePassword from "@/components/auth/usernamePassword";

export default function Index() {
    return (
        <Layout>
            <Box
                component="div"
                className="h-screen pt-64"
            >
                <Card variant="outlined" className="mt-1/2 py-6 w-9/12 mx-auto">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img className="mx-auto h-10 w-auto" src="/images/ullr.png" alt="Freya"/>
                        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Welcome to Ullr Health</h2>
                    </div>

                    <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                        <UsernamePassword />
                    </div>
                </Card>
            </Box>
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
    return { props: {  } };
};