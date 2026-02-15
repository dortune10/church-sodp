"use client";

import { useState } from "react";
import { z } from "zod";
import { contactSchema, prayerSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Card, CardContent } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";

export default function ContactForm() {
    const [formType, setFormType] = useState<"contact" | "prayer">("contact");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);
        setFieldErrors({});

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Validate
        try {
            if (formType === "contact") {
                contactSchema.parse(data);
            } else {
                prayerSchema.parse(data);
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                const errors: Record<string, string> = {};
                err.issues.forEach(e => {
                    if (e.path[0]) errors[e.path[0].toString()] = e.message;
                });
                setFieldErrors(errors);
                setLoading(false);
                return;
            }
        }

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
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-muted/30 border-border">
            <CardContent className="p-8">
                <div className="flex gap-4 mb-8">
                    <Button
                        onClick={() => setFormType("contact")}
                        variant={formType === "contact" ? "default" : "ghost"}
                        className={formType === "contact" ? "underline underline-offset-4" : ""}
                    >
                        Contact Form
                    </Button>
                    <Button
                        onClick={() => setFormType("prayer")}
                        variant={formType === "prayer" ? "secondary" : "ghost"}
                        className={formType === "prayer" ? "underline underline-offset-4" : ""}
                    >
                        Prayer Request
                    </Button>
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
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                type="text"
                                className={fieldErrors.fullName ? "border-red-500" : ""}
                            />
                            {fieldErrors.fullName && <p className="text-xs text-red-500">{fieldErrors.fullName}</p>}
                        </div>
                        {formType === "contact" && (
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={fieldErrors.email ? "border-red-500" : ""}
                                />
                                {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
                            </div>
                        )}
                    </div>

                    {formType === "contact" && (
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                name="subject"
                                type="text"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="message">
                            {formType === "contact" ? "Message" : "Prayer Request"}
                        </Label>
                        <Textarea
                            id="message"
                            name={formType === "contact" ? "message" : "request"}
                            rows={5}
                            className={fieldErrors.message || fieldErrors.request ? "border-red-500" : ""}
                        />
                        {(fieldErrors.message || fieldErrors.request) && (
                            <p className="text-xs text-red-500">{fieldErrors.message || fieldErrors.request}</p>
                        )}
                    </div>

                    {formType === "prayer" && (
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="sharePublicly"
                                name="sharePublicly"
                                defaultChecked
                                className="border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <Label htmlFor="sharePublicly" className="text-muted-foreground font-normal">
                                Share with our prayer team only (Keep private)
                            </Label>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                        variant={formType === "contact" ? "default" : "secondary"}
                    >
                        {loading ? "Sending..." : `Send ${formType === "contact" ? "Message" : "Request"}`}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
