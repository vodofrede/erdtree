import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { NavLinks } from "./ui/NavLinks";

export const metadata: Metadata = {
    title: "Elden Ring Build Tools - Erdtree",
    description: "Elden Ring Build Tools - Armor, Weapon and Class Optimizer",
    authors: { name: "Camburgaler", url: "https://github.com/Camburgaler" },
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
    const VERSION = require("../../package.json").version;
    return (
        <html lang="en">
            <body>
                <NavLinks />
                {children}
                <Analytics />
                <SpeedInsights />
                <footer>
                    <h5>
                        v{VERSION} of Erdtree Planner (
                        <Link
                            href="https://github.com/Camburgaler/erdtree"
                            style={{ color: "var(--link-color)" }}
                        >
                            available under BSD-3-Clause license
                        </Link>
                        )
                    </h5>
                    <h5>
                        Forked from{" "}
                        <Link
                            href="https://github.com/vodofrede"
                            style={{ color: "var(--link-color)" }}
                        >
                            vodofrede
                        </Link>
                        &apos;s Erdtree Planner
                    </h5>
                    <h5>© 2024 Camburgaler</h5>
                </footer>
            </body>
        </html>
    );
}
