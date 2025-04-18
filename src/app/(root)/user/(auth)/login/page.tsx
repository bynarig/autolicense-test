import {signIn} from "@/app/(root)/user/(auth)/auth";
import Navbar from "@/shared/ui/basics/navbar/Navbar";
import Footer from "@/shared/ui/basics/Footer";
import {redirect} from "next/navigation";

interface Props {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function Page(props: Props) {
    const searchParams = await props.searchParams;
    const hasError = searchParams.error === '1';

    return (
        <>
            <Navbar/>
            <div className="flex justify-center h-140 mt-55">
                <form
                    className="card bg-base-100 w-96 shadow-sm"
                    action={async (formData) => {
                        "use server"
                        try {
                            await signIn("credentials", {
                                email: formData.get("email") as string,
                                password: formData.get("password") as string,
                                redirect: false,
                            })
                        } catch (e) {
                            redirect('/user/login?error=1');
                        }
                        redirect('/');
                    }}
                >
                    <div className="flex justify-center">
                        <h1 className="text-6xl">Login</h1>
                    </div>

                    {hasError && (
                        <div className="text-red-500 text-center mb-4">
                            Check your credentials
                        </div>
                    )}

                    <div className="card-body">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="input input-bordered"
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="input input-bordered"
                            required
                        />
                        <button type="submit" className="btn btn-primary">
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
            <Footer/>
        </>
    );
}