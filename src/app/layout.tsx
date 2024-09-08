import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { NavLinks } from "./ui/NavLinks";

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
            <body>
                <NavLinks />
                {children}
                <Analytics />
                <SpeedInsights />
                <footer>
                    <h5>
                        Erdtree Planner (
                        <Link
                            href="https://git.palmoe.dk/vodofrede/erdtree"
                            style={{ color: "var(--link-color)" }}
                        >
                            available under BSD-3-Clause license
                        </Link>
                        )
                    </h5>
                    <h5>© 2024 vodofrede</h5>
                </footer>
            </body>
        </html>
    );
}
