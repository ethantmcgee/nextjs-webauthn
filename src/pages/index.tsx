import Layout from '@/components/layout';
import { useRouter } from "next/router";

export default function Index() {
    const router = useRouter();

    return (
        <Layout>
            <h1>Welcome</h1>
            <button onClick={() => router.push("/login")}>Login</button>
            <button onClick={() => router.push("/register")}>Register</button>
        </Layout>
    );
}