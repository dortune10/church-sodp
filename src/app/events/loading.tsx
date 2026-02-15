export default function Loading() {
    return (
        <div className="flex flex-col">
            {/* Page Header Skeleton */}
            <section className="bg-primary py-20 text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <div className="h-10 w-48 bg-white/10 rounded-lg mx-auto mb-4 animate-pulse"></div>
                    <div className="h-6 w-96 bg-white/10 rounded-lg mx-auto animate-pulse"></div>
                </div>
            </section>

            {/* Events Feed Skeleton */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Events Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6"></div>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-background border border-border rounded-2xl p-6 flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-48 aspect-video md:aspect-square bg-muted rounded-xl animate-pulse shrink-0"></div>
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 w-32 bg-secondary/20 rounded animate-pulse"></div>
                                        <div className="h-7 w-3/4 bg-muted rounded animate-pulse"></div>
                                        <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
                                        <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            <div className="bg-muted/30 p-6 rounded-2xl border border-border h-96 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
