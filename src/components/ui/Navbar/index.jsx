"use client";
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Brand from '../Brand';
//import NavLink from '../NavLink';

const Navbar = () => {
    const [state, setState] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);

    const baseNavigation = [
        { title: "Start Building", path: "/content" },
        // { title: "Testimonials", path: "#testimonials" },
    ];

    const getNavigation = () => {
        const nav = [...baseNavigation];
        if (user) {
            nav.push({ title: "Profile", 
                        path: "/profile",
                        icon:
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-5 h-5">
                        <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/><circle cx="12" cy="10" r="3"/><circle cx="12" cy="12" r="10"/></svg>
                     });
        }
        return nav;
    };

    useEffect(() => {
        // Close the navbar menu when navigate
        const handleState = () => {
            document.body.classList.remove("overflow-hidden")
            setState(false)
        };
        router.events?.on("routeChangeStart", handleState); // Optional chaining for safety
        
        return () => {
            router.events?.off("routeChangeStart", handleState);
        };
    }, [router]);

    useEffect(() => {
        const checkUser = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser && storedUser !== "undefined") {
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to parse user data:", error);
                setUser(null);
            }
        };
    
        checkUser();
    
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                checkUser();
            }
        };
    
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleNavMenu = () => {
        setState(!state)
        document.body.classList.toggle("overflow-hidden")
    }

    const handleLogout = () => {
          localStorage.removeItem('user');
          setUser(null);
          router.push('/');
        };

    return (
        <header>
            <nav className={`bg-white w-full md:static md:text-sm ${state ? "fixed z-10 h-full" : ""}`}>
                <div className="custom-screen items-center mx-auto md:flex font-['comfortaa']">
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <Brand />
                        <div className="md:hidden">
                            <button role="button" aria-label="Open the menu" className="text-gray-500 hover:text-gray-800"
                                onClick={handleNavMenu}
                            >
                                {
                                    state ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                        </svg>
                                    )
                                }
                            </button>
                        </div>
                    </div>
                    <div className={`flex-1 pb-3 mt-8 md:pb-0 md:mt-0 md:block ${state ? "" : "hidden"}`}>
                        <ul className="text-gray-700 justify-end text-lg items-center space-y-6 md:flex md:space-x-6 md:space-y-0 md:text-gray-600 md:font-medium">
                            {
                                getNavigation().map((item, idx) => (
                                        <li key={idx} className="duration-150 hover:text-gray-900">
                                            <Link
                                                href={item.path}
                                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                                            >
                                                {item.icon && (
                                                    <span className="flex-shrink-0">
                                                        {item.icon}
                                                    </span>
                                                )}
                                                {item.title}
                                            </Link>
                                        </li>
                                    
                                ))
                            }
                            <li>
                            {user ? (
                                <>
                                    {/* <img 
                                    src={user.picture} 
                                    alt={user.name} 
                                    className="w-8 h-8 rounded-full"
                                    /> */}
                                    <button 
                                    onClick={handleLogout}
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 active:bg-gray-900 md:inline"
                                    >
                                    Sign Out
                                    </button>
                                </>
                                ) : (
                                <button 
                                    onClick={() => router.push('/auth')}
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 active:bg-gray-900 md:inline"
                                >
                                    Sign In
                                </button>
                                )}
                                {/* <NavLink
                                    href="/signin"
                                    className="block font-medium text-lg text-white bg-orange-500 hover:bg-gray-600 active:bg-gray-900 md:inline"
                                    // onClick={() => {
                                    //     document.body.classList.remove("overflow-hidden");
                                    //     setState(false);
                                    //   }}
                                >
                                    Sign in
                                </NavLink> */}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar