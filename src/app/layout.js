"use client";
import React from "react";
import { useState } from "react";
import { Comfortaa, Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Head from "next/head"
import Footer from "@/components/ui/Footer"
import Navbar from '@/components/ui/Navbar';


const CLIENT_ID = "969688947962-2qq6dqndbiuapu8d4voll1ejss7flo35.apps.googleusercontent.com"

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


export default function RootLayout({ children }) {  
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${comfortaa.variable}`}>
      <Head>
        <title>QuickCover</title>
        <meta name='description' content='Skip the blank page stress and generate a job-winning cover letter tailored to any role, instantly.' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <body className="antialiased">
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <Navbar />
          {children}
        <Footer />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
