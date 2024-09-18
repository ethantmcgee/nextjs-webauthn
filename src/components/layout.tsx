import MuiXLicense from '@/lib/muix';

export default function Layout(props: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                {props.children}
                <MuiXLicense />
            </body>
        </html>
    );
}