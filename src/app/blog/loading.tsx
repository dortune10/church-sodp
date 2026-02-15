export default function Loading() {
    return (
        <div className="flex flex-col">
            {/* Page Header Skeleton */}
            <section className="bg-muted py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-4 animate-pulse"></div>
                    <div className="h-6 w-96 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto animate-pulse"></div>
                </div>
            </section>

            {/* Blog Feed Skeleton */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-background border border-border rounded-3xl overflow-hidden h-full flex flex-col">
                                <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                                <div className="p-8 flex-1 flex flex-col space-y-4">
                                    <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                    </div>
                                    <div className="flex items-center gap-3 pt-6 border-t border-border mt-auto">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
