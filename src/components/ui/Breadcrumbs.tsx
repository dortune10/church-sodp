import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={`mb-6 flex items-center text-sm ${className}`}>
            <ol className="flex items-center space-x-2">
                <li>
                    <Link
                        href="/"
                        className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
                    >
                        <Home className="h-4 w-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50 mx-1" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-foreground font-semibold" aria-current="page">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
