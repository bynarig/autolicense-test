// app/components/UserDropdown.tsx
"use client"
import Link from "next/link";
import {googleSignIn, userSignOut} from "@/app/(root)/user/(auth)/auth-actions";
import { useSession } from "next-auth/react"

export default function UserDropdown() {
    const { data: session, status } = useSession();
    if (session?.user) {
        return (
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                        </svg>
                    </div>
                </div>

                <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow">
                    <li>
                        <Link className="justify-between" href="/user/profile">
                            {session.user.name}'s profile
                            <span className="badge">New</span>
                        </Link>
                    </li>
                    <li><a>Settings</a></li>
                    <li>
                        <button onClick={() => userSignOut()}>Logout</button>
                    </li>
                </ul>
            </div>
        );
    } else {
        return (
            <>
                <button className="btn btn-ghost" onClick={() => googleSignIn()}>Login</button>
            </>
        )
    }

}
