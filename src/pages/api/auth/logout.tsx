import { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from 'iron-session';
import { sessionOptions } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session: any = await getIronSession(req, res, sessionOptions);
    await session.destroy();
    res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
}