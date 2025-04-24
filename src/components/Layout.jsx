import Head from "next/head"
import Footer from "./ui/Footer"
import Navbar from "./ui/Navbar"
import { Comfortaa, Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  display: "swap",
});

const Layout = ({ children }) => {
    return (
        <>
            <Head>
                <title>QuickCover</title>
                <meta name='description' content='Skip the blank page stress and generate a job-winning cover letter tailored to any role, instantly.' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                {/* <link rel='icon' href='/favicon.ico' /> */}
            </Head>
            <Navbar />
            <main className={`${geistSans.variable} ${geistMono.variable} ${comfortaa.variable} antialiased`}>{children}</main>
            <Footer />
        </>
    )
}

export default Layout