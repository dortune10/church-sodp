"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Error:", error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
                We encountered an unexpected error. Please try again, or contact support if the problem persists.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="rounded-md bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90 transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
