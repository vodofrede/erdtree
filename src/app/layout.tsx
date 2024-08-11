import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Elden Ring Build Tools - Erdtree",
    description: "Elden Ring Build Tools - Armor, Weapon and Class Optimizer",
    authors: { name: "vodofrede", url: "https://github.com/vodofrede" },
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
