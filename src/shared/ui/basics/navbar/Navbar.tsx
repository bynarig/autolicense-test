// app/components/Navbar.tsx
import Link from "next/link";
// import { auth } from "@/app/auth";
import UserDropdown from "./UserDropdown";

export default async function Navbar() {
    // const session: Session | null = await auth();

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
            <div className="flex-1">
                <Link className="btn btn-ghost text-xl" href="/public">
                    Ireland FAQ
                </Link>
            </div>
            <div className="flex gap-2">
                <UserDropdown />
            </div>
        </div>
    );
}
