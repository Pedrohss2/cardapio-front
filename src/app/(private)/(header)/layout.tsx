"use client";

import Header from "@/src/components/general/Header";

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="min-h-screen transition-all duration-300 main-content">
                {children}
            </main>
        </>
    );
}
