"use client"

import Navbar from "@/shared/ui/Navbar";
import Footer from "@/shared/ui/Footer";
import {useSelector} from "react-redux";
import {RootState} from "@/shared/store";

export default function Page() {
    const isLogged = useSelector((state: RootState) => state.userSlice.isLogged);
    return (
        <>
            <Navbar/>
            {
                isLogged ?
                    <div>
                        <div className="avatar">
                            <div className="w-24 rounded-xl">
                                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt={""} width={24} height={24}/>
                            </div>
                            <h3 className="text-7xl">Hi, username</h3>
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