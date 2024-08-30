import { NextApiRequest, NextApiResponse } from "next";
import { login } from "@/lib/auth";
import { getIronSession } from 'iron-session';
import { sessionOptions } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session: any = await getIronSession(req, res, sessionOptions);
        const userId = await login(req, res, session);
        session.userId = userId.toString();
        await session.save();

        res.json({ userId: userId.toString() });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}