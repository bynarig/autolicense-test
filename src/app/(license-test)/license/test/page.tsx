"use client"

import Navbar from "@/shared/ui/Navbar";
import Footer from "@/shared/ui/Footer";
import {useSelector} from "react-redux";
import {RootState} from "@/shared/store";
import TestCard from "@/shared/ui/testing/TestCard";

export default function Page() {
    const isLogged = useSelector((state: RootState) => state.userSlice.isLogged);
    return (
        <>
            <Navbar/>
            {
                isLogged ? <div className="flex justify-center">
                        <>
                            <div className="">
                            <TestCard/>

                            </div>
                        </>
                    </div>

                    : <div className="flex justify-center h-140 mt-70">
                        <div className="card bg-base-100 w-140 shadow-sm">
                            <div className="flex justify-center">
                                <h1 className="text-4xl md:text-6xl">Need to LogIn to take test 😵</h1>

                            </div>
                        </div>
                    </div>
            }


            <Footer/>
        </>
    );
}