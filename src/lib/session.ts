import type { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD!,
    cookieName: "next-webauthn",
    ttl: 60 * 60 * 24, // 1 day
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    },
};

// Define the cookie structure globally for TypeScript
declare module "iron-session" {
    interface IronSessionData {
        userId?: number;
        challenge?: string;
    }
}