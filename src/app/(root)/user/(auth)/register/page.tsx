import Navbar from "@/shared/ui/basics/navbar/Navbar"
import Footer from "@/shared/ui/basics/Footer"
import {signup} from "./register"
import {formSchema} from "@/shared/lib/zod";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ errors?: string }>;
}

export default async function RegisterPage(props: Props) {
  const searchParams = await props.searchParams;
  const errors = searchParams.errors
    ? JSON.parse(searchParams.errors)
    : {}

  return (
    <>
      <Navbar />

      <div className="flex justify-center h-140 mt-55">
        <form
          className="card bg-base-100 w-96 shadow-sm"
          action={async (formData) => {
            "use server"
            const data = {
              name: formData.get("name") as string,
              email: formData.get("email") as string,
              password: formData.get("password") as string,
            }

            // Validate on server before submitting
            const result = formSchema.safeParse(data)
            if (!result.success) {
              const errors: Record<string, string> = {}
              result.error.errors.forEach((err) => {
                errors[err.path[0]] = err.message
              })
              const searchParams = new URLSearchParams({
                errors: JSON.stringify(errors),
              }).toString();
              redirect(`/user/register?${searchParams}`);
            }

            await signup(data)
            redirect("/dashboard"); // Redirect to success page
          }}
        >
          <div className="flex justify-center">
            <h1 className="text-6xl">Register</h1>
          </div>
          <div className="card-body">
            <input
              name="email"
              type="email"
              placeholder="email"
              className="input"
              defaultValue=""
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <input
              name="name"
              type="text"
              placeholder="name"
              className="input"
              defaultValue=""
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            <input
              name="password"
              type="password"
              placeholder="password"
              className="input"
              defaultValue=""
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            <button className="btn">Send</button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  )
}