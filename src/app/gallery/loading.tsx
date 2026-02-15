export default function Loading() {
    return (
        <div className="flex flex-col">
            {/* Page Header Skeleton */}
            <section className="bg-muted py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-4 animate-pulse"></div>
                    <div className="h-6 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto animate-pulse"></div>
                </div>
            </section>

            {/* Gallery Grid Skeleton */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-square bg-muted rounded-3xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
