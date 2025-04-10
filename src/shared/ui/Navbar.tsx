'use client'

import LanguageSwitch from "@/features/languageSwitch";
import Link from "next/link";
import {login, logout} from "@/shared/store/user/userSlice";
import {UserMockData} from "@/shared/data/mock/userInfo";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/shared/store";

export default function Navbar() {
    const isLogged = useSelector((state: RootState) => state.userSlice.isLogged);
    const dispatch = useDispatch();

    function LogIn() {
        dispatch(login({
            UserMockData
        }))
    }

    function LogOut() {
        dispatch(logout())
    }

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
            <div className="flex-1">
                <Link className="btn btn-ghost text-xl" href="/">Ireland FAQ</Link>
            </div>
            <div className="flex gap-2">
                <LanguageSwitch/>
                {isLogged ?
                    <div className="dropdown dropdown-end">

                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center     ">
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

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <Link className="justify-between" href="/user/profile">
                                    Profile
                                    <span className="badge">New</span>
                                </Link>
                            </li>
                            <li><a>Settings</a></li>
                            <li><a onClick={LogOut}>Logout</a></li>
                        </ul>
                    </div> : <button className="btn btn-ghost" onClick={LogIn}>Login</button>
                }


            </div>
        </div>
    );
}