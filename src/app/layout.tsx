import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
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
                    <span style={{ display: "flex", flexDirection: "column" }}>
                        <h5>
                            Forked from{" "}
                            <a
                                href="https://github.com/vodofrede"
                                style={{ color: "var(--link-color)" }}
                            >
                                vodofrede
                            </a>
                            &apos;s Erdtree Planner
                        </h5>
                        <h5>
                            v{VERSION} of Erdtree Planner (available under
                            BSD-3-Clause license)
                        </h5>
                    </span>
                    <span
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "right",
                        }}
                    >
                        <h5>
                            © 2024{" "}
                            <a href="https://github.com/Camburgaler">
                                Camburgaler
                            </a>
                        </h5>
                        <h5>
                            Have suggestions?{" "}
                            <a href="https://github.com/Camburgaler/erdtree/issues/new">
                                Create an issue!
                            </a>{" "}
                        </h5>
                    </span>
                </footer>
            </body>
        </html>
    );
}
