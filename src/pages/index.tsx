import { Fragment } from "react";
import { useRouter } from "next/router";

export default function Index() {
    const router = useRouter();

    return (
        <Fragment>
            <h1>Welcome</h1>
            <button onClick={() => router.push("/login")}>Login</button>
            <button onClick={() => router.push("/register")}>Register</button>
        </Fragment>
    );
}