import { FormEvent, Fragment, useEffect, useState } from "react";
import { supported, get } from "@github/webauthn-json";
import { generateChallenge } from "../lib/auth";
import { sessionOptions } from "../lib/session";
import { useRouter } from "next/router";
import { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";

export default function Login({ challenge }: { challenge: string }) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAvailability = async () => {
            return (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
        };
        checkAvailability().then(val => {
            setIsAvailable(val && supported());
        });
    }, []);

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        // Retrieve a registered passkey from the browser
        const credential = await get({
            publicKey: {
                challenge,
                timeout: 60000,
                userVerification: "required",
                rpId: "localhost",
            },
        });

        const result = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, credential }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (result.ok) {
            router.push("/admin");
        } else {
            const { message } = await result.json();
            setError(message);
        }
    };

    return (
        <Fragment>
            <h1>Login</h1>
            {isAvailable ? (
                <form method="POST" onSubmit={onSubmit}>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <input type="submit" value="Login" />
                    {error != null ? <pre>{error}</pre> : null}
                </form>
            ) : (
                <p>Sorry, webauthn is not available.</p>
            )}
        </Fragment>
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

    const challenge = generateChallenge();
    session.challenge = challenge;
    await session.save();
    return { props: { challenge } };
};