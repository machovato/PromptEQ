"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function GlobalHeader() {
    const pathname = usePathname();

    return (
        <div className="flex justify-between items-center bg-white border-b border-[#E5E5E5] px-6 py-4 md:px-10">
            <Link href="/" className="flex items-center gap-3 no-underline">
                <img src="/logo.png" alt="PromptEQ Logo" className="w-8 h-8 rounded-lg" />
                <div className="text-[22px] font-[800] tracking-[-0.5px] text-[#131620]">PromptEQ</div>
            </Link>

            <div className="flex items-center gap-6">
                <NavLink href="/" current={pathname}>Home</NavLink>
                <NavLink href="/generate" current={pathname}>Generate</NavLink>
                <NavLink href="/about" current={pathname}>About</NavLink>
            </div>
        </div>
    );
}

function NavLink({ href, current, children }) {
    const isActive = current === href;
    return (
        <Link
            href={href}
            className={`text-[13px] font-['Inter'] no-underline transition-colors ${isActive ? 'text-[#131620] font-[800]' : 'text-[#6B7280] font-[600] hover:text-[#131620]'
                }`}
        >
            {children}
        </Link>
    );
}
