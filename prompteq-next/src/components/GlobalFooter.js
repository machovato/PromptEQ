import Link from 'next/link';

export function GlobalFooter() {
    return (
        <div className="border-t border-[#E5E5E5] bg-white px-6 py-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[13px] text-[#6B7280] font-mono">
                PromptEQ — The Prompt Equalizer • © {new Date().getFullYear()}
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6">
                <FooterLink href="/">Home</FooterLink>
                <FooterLink href="/generate">Generate</FooterLink>
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="https://linkedin.com/in/tonymelendez" external>Built by Tony</FooterLink>
            </div>
        </div>
    );
}

function FooterLink({ href, external, children }) {
    const Component = external ? 'a' : Link;
    const props = external ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };

    return (
        <Component
            {...props}
            className="text-sm text-[#6B7280] hover:text-[#131620] font-semibold font-['Inter'] transition-colors no-underline"
        >
            {children}
        </Component>
    );
}
