// app/(auth)/register/page.tsx
import Navbar from "@/shared/ui/basics/navbar/Navbar"
import Footer from "@/shared/ui/Footer"
import { signup } from "./register"

export default function RegisterPage() {
  return (
    <>
      <Navbar />

      <div className="flex justify-center h-140 mt-55">
        <form
          className="card bg-base-100 w-96 shadow-sm"
          action={async (formData) => {
            "use server"
            const name = formData.get("name") as string
            const email = formData.get("email") as string
            const password = formData.get("password") as string
            await signup({ name, email, password })
          }}
        >
          <div className="flex justify-center">
            <h1 className="text-6xl">Register</h1>
          </div>
          <div className="card-body">
            <input name="email" type="email" placeholder="email" className="input" />
            <input name="name" type="text" placeholder="name" className="input" />
            <input
              name="password"
              type="password"
              placeholder="password"
              className="input"
            />
            <button className="btn">Send</button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  )
}