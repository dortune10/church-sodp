import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
                href="/"
                className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
                Go Back Home
            </Link>
        </div>
    );
}
