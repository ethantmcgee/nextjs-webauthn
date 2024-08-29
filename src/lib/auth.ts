import crypto from "node:crypto";
import type {
    VerifiedAuthenticationResponse,
    VerifiedRegistrationResponse,
} from "@simplewebauthn/server";
import {
    verifyAuthenticationResponse,
    verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type {
    PublicKeyCredentialWithAssertionJSON,
    PublicKeyCredentialWithAttestationJSON,
} from "@github/webauthn-json";
import { NextApiRequest, NextApiResponse } from "next";
import {AuthenticationResponseJSON, RegistrationResponseJSON} from "@simplewebauthn/types";
import { db } from "@/lib/db";
import { users, passkey } from "@/lib/schema";

const HOST_SETTINGS = {
    expectedOrigin: process.env.ORIGIN_URL!,
    expectedRPID: process.env.RPID!,
};

function binaryToBase64url(bytes: Uint8Array) {
    let str = "";

    bytes.forEach((charCode) => {
        str += String.fromCharCode(charCode);
    });

    return btoa(str);
}

export async function register(req: NextApiRequest, res: NextApiResponse, session: any) {
    const challenge = session.challenge ?? "";
    const credential = req.body
        .credential as PublicKeyCredentialWithAttestationJSON;
    const { email } = req.body;

    let verification: VerifiedRegistrationResponse;

    if (credential == null) {
        throw new Error("Invalid Credentials");
    }

    try {
        verification = await verifyRegistrationResponse({
            response: credential as RegistrationResponseJSON,
            expectedChallenge: challenge,
            requireUserVerification: true,
            ...HOST_SETTINGS,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }

    if (!verification.verified) {
        throw new Error("Registration verification failed");
    }

    const { credentialID, credentialPublicKey } =
    verification.registrationInfo ?? {};

    if (credentialID == null || credentialPublicKey == null) {
        throw new Error("Registration failed");
    }

    const insertUser = (await db.insert(users).values({
        email,
    }).returning({ insertedId: users.id }))[0];
    await db.insert(passkey).values({
        name: 'initial-passkey',
        userId: insertUser.insertedId,
        externalId: clean(binaryToBase64url(credentialID)),
        publicKey: Buffer.from(credentialPublicKey),
    });

    console.log(`Registered new user ${insertUser.insertedId}`);
    return insertUser;
}

export async function login(req: NextApiRequest, res: NextApiResponse, session: any) {
    const challenge = session.challenge ?? "";
    const credential = req.body
        .credential as PublicKeyCredentialWithAssertionJSON;
    const email = req.body.email;

    if (credential?.id == null) {
        throw new Error("Invalid Credentials");
    }

    // Find our credential record
    const userCredential = await prisma.credential.findUnique({
        select: {
            id: true,
            userId: true,
            externalId: true,
            publicKey: true,
            signCount: true,
            user: {
                select: {
                    email: true,
                },
            },
        },
        where: {
            externalId: credential.id,
        },
    });

    if (userCredential == null) {
        throw new Error("Unknown User");
    }

    let verification: VerifiedAuthenticationResponse;
    try {
        // Verify browser credential with our record
        verification = await verifyAuthenticationResponse({
            response: credential as AuthenticationResponseJSON,
            expectedChallenge: challenge,
            authenticator: {
                credentialID: userCredential.externalId,
                credentialPublicKey: userCredential.publicKey,
                counter: userCredential.signCount,
            },
            ...HOST_SETTINGS,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }

    if (!verification.verified || email !== userCredential.user.email) {
        throw new Error("Login verification failed");
    }

    console.log(`Logged in as user ${userCredential.userId}`);
    return userCredential.userId;
}

function clean(str: string) {
    return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function generateChallenge() {
    return clean(crypto.randomBytes(32).toString("base64"));
}