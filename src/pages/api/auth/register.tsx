import { NextApiRequest, NextApiResponse } from "next";
import { register } from "@/lib/auth";
import { getIronSession } from 'iron-session';
import { sessionOptions } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session: any = await getIronSession(req, res, sessionOptions);
        const user = await register(req, res, session);
        session.userId = user.insertedId.toString();
        await session.save();

        res.json({ userId: user.insertedId.toString() });
    } catch (error: unknown) {
        res.status(500).json({ message: (error as Error).message });
    }
}