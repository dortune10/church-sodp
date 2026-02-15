import Link from "next/link";

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    icon?: React.ReactNode;
}

export default function EmptyState({
    title,
    description,
    actionLabel,
    actionHref,
    icon,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border rounded-3xl bg-muted/10">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-6">
                {icon || (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                )}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-sm mb-8">{description}</p>
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
                >
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}
