export default function Loading() {
    return (
        <div className="flex-1 p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 bg-background border border-border rounded-xl h-32 animate-pulse space-y-4">
                        <div className="h-4 w-24 bg-muted rounded"></div>
                        <div className="h-8 w-16 bg-muted rounded"></div>
                    </div>
                ))}
            </div>

            <div className="bg-background border border-border rounded-xl h-96 animate-pulse"></div>
        </div>
    );
}
