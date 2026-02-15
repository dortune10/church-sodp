export default function Loading() {
    return (
        <div className="flex flex-col">
            {/* Page Header Skeleton */}
            <section className="bg-primary py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="h-10 w-48 bg-white/10 rounded-lg mx-auto mb-4 animate-pulse"></div>
                    <div className="h-6 w-96 bg-white/10 rounded-lg mx-auto animate-pulse"></div>
                </div>
            </section>

            {/* Search Bar Skeleton */}
            <section className="py-8 border-b border-border">
                <div className="container mx-auto px-4">
                    <div className="h-12 w-full max-w-xl mx-auto bg-muted rounded-full animate-pulse"></div>
                </div>
            </section>

            {/* Sermons Feed Skeleton */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="group bg-background border border-border rounded-3xl overflow-hidden flex flex-col">
                                <div className="aspect-video bg-muted animate-pulse relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 bg-background/20 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                                        <div className="h-1 w-1 bg-muted rounded-full"></div>
                                        <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                                    </div>
                                    <div className="h-7 w-full bg-muted rounded animate-pulse"></div>
                                    <div className="h-5 w-3/4 bg-muted rounded animate-pulse"></div>
                                    <div className="pt-6 mt-auto">
                                        <div className="h-10 w-full bg-muted rounded-xl animate-pulse"></div>
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
