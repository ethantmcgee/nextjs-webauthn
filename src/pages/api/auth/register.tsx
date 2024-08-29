import { NextApiRequest, NextApiResponse } from "next";
import { register } from "@/lib/auth";
import { getIronSession } from 'iron-session';
import { sessionOptions } from "@/lib/session";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session: any = getIronSession(req, res, sessionOptions);
        const user = await register(req, res, session);
        session.userId = user.id;
        await session.save();

        res.json({ userId: user.id });
    } catch (error: unknown) {
        console.error((error as Error).message);
        res.status(500).json({ message: (error as Error).message });
    }
}