"use client";

import LanguageSwitch from "@/features/languageSwitch";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
  <div className="flex-1">
    <Link className="btn btn-ghost text-xl" href="/">Ireland FAQ</Link>
  </div>
  <div className="flex gap-2">
      <LanguageSwitch/>

    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <Image
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
    );
}