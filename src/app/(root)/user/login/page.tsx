import {signIn} from "@/app/auth"
import Navbar from "@/shared/ui/Navbar";
import Footer from "@/shared/ui/Footer";

export default function Page() {
    return (
        <>
            <Navbar/>

            <div className="flex justify-center h-140 mt-55">
                <form className="card bg-base-100 w-96 shadow-sm" action={async (formData) => {
                    "use server"
                    await signIn("credentials", formData)
                }}>
                    <div className="flex justify-center">
                        <h1 className="text-6xl">Login</h1>
                    </div>
                    <div className="card-body">
                        <input name="email" type="email" placeholder="email" className="input"/>
                        <input name="password" type="password" placeholder="password" className="input"/>
                        <button className="btn">Send</button>
                    </div>
                </form>
            </div>

            <Footer/>
        </>
    );
}