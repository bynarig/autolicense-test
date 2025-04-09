import type {Metadata} from "next";
import Navbar from "@/shared/ui/Navbar";
import Footer from "@/shared/ui/Footer";

export const metadata: Metadata = {
    title: "LII | Info",
    description: "information that you need",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (<>
            <Navbar/>
            {children}
            <Footer/>
        </>


    );
}
