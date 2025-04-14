"use client"

import Link from "next/link";
import UserDropdown from "./UserDropdown";

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
            <div className="flex-1">
                <Link className="btn btn-ghost text-xl" href="/">
                    Ireland FAQ
                </Link>
            </div>
            <div className="flex gap-2">
                <UserDropdown />
            </div>
        </div>
    );
}
