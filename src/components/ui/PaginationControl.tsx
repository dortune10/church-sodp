import Link from "next/link";

interface PaginationControlProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export default function PaginationControl({
    currentPage,
    totalPages,
    baseUrl,
}: PaginationControlProps) {
    if (totalPages <= 1) return null;

    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return (
        <div className="flex items-center justify-center gap-4 py-8 mt-8 border-t border-border">
            {prevPage ? (
                <Link
                    href={`${baseUrl}?page=${prevPage}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted transition-colors"
                >
                    &larr; Previous
                </Link>
            ) : (
                <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-muted/50 border border-border rounded-md cursor-not-allowed opacity-50"
                >
                    &larr; Previous
                </button>
            )}

            <span className="text-sm font-medium text-muted-foreground">
                Page {currentPage} of {totalPages}
            </span>

            {nextPage ? (
                <Link
                    href={`${baseUrl}?page=${nextPage}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted transition-colors"
                >
                    Next &rarr;
                </Link>
            ) : (
                <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-muted/50 border border-border rounded-md cursor-not-allowed opacity-50"
                >
                    Next &rarr;
                </button>
            )}
        </div>
    );
}
