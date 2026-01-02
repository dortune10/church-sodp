"use client";

import { useState } from "react";

export default function ContactForm() {
    const [formType, setFormType] = useState<"contact" | "prayer">("contact");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const endpoint = formType === "contact" ? "/api/contact" : "/api/prayer";
            const response = await fetch(endpoint, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Something went wrong. Please try again.");

            setSuccess(true);
            (e.target as HTMLFormElement).reset();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-muted/30 p-8 rounded-2xl border border-border transition-colors">
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setFormType("contact")}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${formType === "contact"
                        ? "bg-primary text-primary-foreground underline underline-offset-4"
                        : "bg-background text-muted-foreground hover:bg-muted"
                        }`}
                >
                    Contact Form
                </button>
                <button
                    onClick={() => setFormType("prayer")}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${formType === "prayer"
                        ? "bg-secondary text-secondary-foreground underline underline-offset-4"
                        : "bg-background text-muted-foreground hover:bg-muted"
                        }`}
                >
                    Prayer Request
                </button>
            </div>

            {success && (
                <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md font-medium">
                    Thank you! Your {formType === "contact" ? "message" : "request"} has been sent.
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md font-medium">
                    {error}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                            name="fullName"
                            type="text"
                            required
                            className="w-full rounded-md border-border bg-background p-2 ring-1 ring-border focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    {formType === "contact" && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full rounded-md border-border bg-background p-2 ring-1 ring-border focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    )}
                </div>

                {formType === "contact" && (
                    <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <input
                            name="subject"
                            type="text"
                            className="w-full rounded-md border-border bg-background p-2 ring-1 ring-border focus:ring-2 focus:ring-primary"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-2">
                        {formType === "contact" ? "Message" : "Prayer Request"}
                    </label>
                    <textarea
                        name={formType === "contact" ? "message" : "request"}
                        required
                        rows={5}
                        className="w-full rounded-md border-border bg-background p-2 ring-1 ring-border focus:ring-2 focus:ring-primary"
                    ></textarea>
                </div>

                {formType === "prayer" && (
                    <div className="flex items-center gap-2">
                        <input
                            id="sharePublicly"
                            name="sharePublicly"
                            type="checkbox"
                            defaultChecked
                            className="rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor="sharePublicly" className="text-sm text-muted-foreground">
                            Share with our prayer team only (Keep private)
                        </label>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-md font-bold transition-opacity ${formType === "contact" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                        } disabled:opacity-50`}
                >
                    {loading ? "Sending..." : `Send ${formType === "contact" ? "Message" : "Request"}`}
                </button>
            </form>
        </div>
    );
}
