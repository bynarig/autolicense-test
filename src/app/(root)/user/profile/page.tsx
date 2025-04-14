"use client"
import Navbar from "@/shared/ui/basics/navbar/Navbar";
import Footer from "@/shared/ui/Footer";
import Link from "next/link";
import {useSession} from "next-auth/react";

export default function Page() {
    const { data: session, status } = useSession();
    return (
        <>
            <Navbar/>


            {
                session && session.user ?
                    <div>
                        <div className="avatar">
                            <div className="w-24 rounded-xl">
                                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                     alt={""} width={24} height={24}/>
                            </div>
                            <h3 className="text-7xl">Hi, {session.user.name}</h3>
                            <Link className="btn" href="/license/test">go to test system</Link>
                        </div>
                    </div>
                    : <div className="flex justify-center h-140 mt-70">
                        <div className="card bg-base-100 w-180 shadow-sm">
                            <div className="flex justify-center">
                                <h1 className="text-4xl md:text-6xl">What are you looking for? 😵</h1>
                            </div>
                        </div>
                    </div>
            }


            <Footer/>
        </>
    );
}