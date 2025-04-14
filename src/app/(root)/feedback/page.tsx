import Navbar from "@/shared/ui/basics/navbar/Navbar";
import Footer from "@/shared/ui/Footer";

export default function Page() {
    return (
        <>
            <Navbar/>
            <div className="flex justify-center items-center h-screen flex-col">
                <div className="justify-center flex">
                    <h1 className="text-7xl ">Feedback</h1>

                </div>
                <div className="card bg-base-100 w-96 shadow-sm">
                    <input type="text" placeholder="Your mail adress" className="input"/>
                    <input type="text" placeholder="Your text" className="input"/>
                    <button className="btn">Send</button>
                </div>
            </div>
            <Footer/>
        </>
    );
}