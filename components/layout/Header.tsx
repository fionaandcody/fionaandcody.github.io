'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import { usePathname } from 'next/navigation';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const closeMenu = () => setIsOpen(false);

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo / Site Title */}
                    <Link href="/" className={`${playfair.className} text-2xl font-bold text-stone-900 tracking-tight hover:opacity-80 transition-opacity`}>
                        Fiona & Cody
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <NavLink href="/" active={pathname === '/'}>Home</NavLink>
                        {/* <NavLink href="/our-story" active={pathname === '/our-story'}>Our Story</NavLink> */}
                        <NavLink href="/wedding" active={pathname === '/wedding'}>Wedding</NavLink>
                        <NavLink href="/adventures" active={pathname.startsWith('/adventures')}>Adventures</NavLink>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-stone-600 hover:text-stone-900 focus:outline-none p-2"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {
                isOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-stone-100 shadow-lg py-4 flex flex-col space-y-4 px-6 animate-in slide-in-from-top-2">
                        <MobileNavLink href="/" onClick={closeMenu}>Home</MobileNavLink>
                        {/* <MobileNavLink href="/our-story" onClick={closeMenu}>Our Story</MobileNavLink> */}
                        <MobileNavLink href="/wedding" onClick={closeMenu}>Wedding</MobileNavLink>
                        <MobileNavLink href="/adventures" onClick={closeMenu}>Adventures</MobileNavLink>
                    </div>
                )
            }
        </header >
    );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode, active?: boolean }) {
    return (
        <Link
            href={href}
            className={`font-medium text-sm tracking-wide transition-colors duration-200 ${active ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-900'}`}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link href={href} onClick={onClick} className="text-lg font-serif text-stone-800 hover:text-stone-500 py-2 border-b border-stone-50">
            {children}
        </Link>
    )
}
