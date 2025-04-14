import {signIn} from "@/app/auth"
import Navbar from "@/shared/ui/Navbar";
import Footer from "@/shared/ui/Footer";
import {prisma} from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import Bcrypt from "@/shared/lib/bcrypt";

export default function Page() {
    const signup = async ({
                              name,
                              email,
                              password,
                          }: {
        name: string;
        email: string;
        password: string;
    }) => {

        "use server"
        const hashedPassword = await Bcrypt.hash(password);

        const existingUser = await prisma.user.findUnique({
            where: {email},
        });

        if (!existingUser) {
            const userData: Prisma.UserCreateInput = {
                email,
                name,
                password: hashedPassword,
            };

            await prisma.user.create({
                data: userData,
            });
        }

        await signIn('credentials', {email, password, });
    };
    return (
        <>
            <Navbar/>

            <div className="flex justify-center h-140 mt-55">
                <form className="card bg-base-100 w-96 shadow-sm" action={async (formData) => {
                    "use server"
                    const name = formData.get('name') as string;
                    const email = formData.get('email') as string;
                    const password = formData.get('password') as string;
                    await signup({name, email, password})
                }}>
                    <div className="flex justify-center">
                        <h1 className="text-6xl">Register</h1>
                    </div>
                    <div className="card-body">
                        <input name="email" type="email" placeholder="email" className="input"/>
                        <input name="name" type="text" placeholder="name" className="input"/>
                        <input name="password" type="password" placeholder="password" className="input"/>
                        <button className="btn">Send</button>
                    </div>
                </form>
            </div>

            <Footer/>
        </>
    );
}