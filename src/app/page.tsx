import Hero from "@/shared/ui/main/Hero";
import Navbar from "@/shared/ui/Navbar";
import Footer from "@/shared/ui/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar/>
        <div>
            <Link className="btn btn-primary" href="/feedback">go to feedback</Link>
            <Link className="btn btn-primary" href="/why-us">go to why us</Link>
            <Link className="btn btn-primary" href="/how-to-get-license">go to how-to-get-license</Link>
        </div>
      <Hero/>
      <Footer/>
    </>
  );
}
