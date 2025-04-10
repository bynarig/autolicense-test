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
                !isLogged ? <div className="flex justify-center h-140 mt-55">
                        <div className="card bg-base-100 w-96 shadow-sm">
                            <div className="flex justify-center">
                                <h1 className="text-6xl">Login</h1>
                            </div>
                            <div className="card-body">
                                <input type="text" placeholder="mail or username" className="input"/>
                                <input type="text" placeholder="password" className="input"/>
                                <button className="btn">Send</button>
                            </div>
                        </div>
                    </div>

                    : <div className="flex justify-center h-140 mt-70">
                        <div className="card bg-base-100 w-140 shadow-sm">
                            <div className="flex justify-center">
                                <h1 className="text-4xl md:text-6xl">Already loggedIn 😵</h1>

                            </div>
                        </div>
                    </div>
            }


            <Footer/>
        </>
    );
}