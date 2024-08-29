import { FormEvent, Fragment, useEffect, useState } from "react";
import { supported, create } from "@github/webauthn-json";
import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import { getIronSession } from 'iron-session';
import { generateChallenge } from "@/lib/auth";
import { sessionOptions } from "@/lib/session";

export default function Register({ challenge }: { challenge: string }) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
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
        // Create the credential
        const credential = await create({
            publicKey: {
                challenge: challenge,
                rp: {
                    // Change these later
                    name: "next-webauthn",
                    id: "localhost",
                },
                user: {
                    // Maybe change these later
                    id: window.crypto.randomUUID(),
                    name: email,
                    displayName: username,
                },
                // Don't change these later
                pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                timeout: 60000,
                attestation: "direct",
                authenticatorSelection: {
                    residentKey: "required",
                    userVerification: "required",
                },
            },
        });
        // Call our registration endpoint with the new account details
        const result = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, username, credential }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        // Redirect to the admin page or render errors
        if (result.ok) {
            router.push("/admin");
        } else {
            const { message } = await result.json();
            setError(message);
        }
    };

    return (
        <Fragment>
            {isAvailable ? (
                <>
                    <h1>Register Account</h1>
                    <form method="POST" onSubmit={onSubmit}>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <input type="submit" value="Register" />
                    </form>
                    {error != null ? <pre>{error}</pre> : null}
                </>
            ) : (
                <p>Sorry, WebAuthn is not available.</p>
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
}