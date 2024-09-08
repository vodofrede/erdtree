"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
    const pathname = usePathname();

    return (
        <nav>
            <h3>
                <Link href="/" className={pathname === "/" ? "current" : ""}>
                    Home
                </Link>
            </h3>
            <h3>
                <Link
                    href="/class"
                    className={pathname === "/class" ? "current" : ""}
                >
                    Starting Class
                </Link>
            </h3>
            <h3>
                <Link
                    href="/armor"
                    className={pathname === "/armor" ? "current" : ""}
                >
                    Armor Optimizer
                </Link>
            </h3>
            <h3>
                <Link
                    href="/weapons"
                    className={pathname === "/weapons" ? "current" : ""}
                >
                    Weapon Finder
                </Link>
            </h3>
        </nav>
    );
}
