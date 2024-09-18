import { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from 'iron-session';
import { sessionOptions } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session: any = await getIronSession(req, res, sessionOptions);
        res.json({});
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}