import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Container } from "@mui/material";

import './global.css';

export default function Index({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen" style={{
            backgroundImage: `url(./images/background.jpg)`,
            backgroundSize: 'cover',
        }}>
            <Header />
            <Container maxWidth="xl">
                {children}
            </Container>
            <Footer />
        </div>
    );
}