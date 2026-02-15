"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Card, CardContent } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select } from "@/components/ui/Select";

export default function NewEventPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRecurring, setIsRecurring] = useState(false);
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York");
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Helper to convert local time + timezone to ISO string
        const formatWithTimezone = (localStr: string | null) => {
            if (!localStr) return null;
            const date = new Date(localStr);
            try {
                return new Date(date.toLocaleString('en-US', { timeZone: timezone })).toISOString();
            } catch {
                return new Date(localStr).toISOString();
            }
        };

        const getRecurringDates = (startDate: Date, frequency: string, endDate: Date) => {
            const dates = [];
            const currentDate = new Date(startDate);

            while (currentDate <= endDate) {
                dates.push(new Date(currentDate));
                if (frequency === "daily") {
                    currentDate.setDate(currentDate.getDate() + 1);
                } else if (frequency === "weekly") {
                    currentDate.setDate(currentDate.getDate() + 7);
                } else if (frequency === "monthly") {
                    currentDate.setMonth(currentDate.getMonth() + 1);
                }
            }

            return dates;
        };

        if (isRecurring) {
            const recurringDates = getRecurringDates(
                new Date(data.startsAt as string),
                data.frequency as string,
                new Date(data.recurrenceEndDate as string)
            );

            const eventsToInsert = recurringDates.map((date) => ({
                title: data.title,
                description: data.description || null,
                start_at: formatWithTimezone(date.toISOString()),
                end_at: data.endsAt ? formatWithTimezone(new Date(data.endsAt as string).toISOString()) : null,
                location: data.location || null,
                registration_enabled: data.registrationEnabled === "on",
                capacity: data.maxRegistrations ? parseInt(data.maxRegistrations as string) : null,
            }));

            const { error } = await supabase.from("events").insert(eventsToInsert);

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                router.push("/admin/events");
                router.refresh();
            }
        } else {
            const { error } = await supabase.from("events").insert([
                {
                    title: data.title,
                    description: data.description || null,
                    start_at: formatWithTimezone(data.startsAt as string),
                    end_at: formatWithTimezone(data.endsAt as string),
                    location: data.location || null,
                    registration_enabled: data.registrationEnabled === "on",
                    capacity: data.maxRegistrations ? parseInt(data.maxRegistrations as string) : null,
                },
            ]);

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                router.push("/admin/events");
                router.refresh();
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/admin/events"
                    className="text-sm font-medium text-muted-foreground hover:text-primary mb-2 inline-block"
                >
                    &larr; Back to Events
                </Link>
                <h1 className="text-3xl font-bold text-primary">Create New Event</h1>
            </div>

            <Card>
                <CardContent className="p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timezone">Event Timezone (Church Local Time)</Label>
                            <Select
                                id="timezone"
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                            >
                                <option value="America/New_York">Eastern Time (ET)</option>
                                <option value="America/Chicago">Central Time (CT)</option>
                                <option value="America/Denver">Mountain Time (MT)</option>
                                <option value="America/Phoenix">Mountain Time - no DST (AZ)</option>
                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                <option value="America/Anchorage">Alaska Time</option>
                                <option value="America/Adak">Hawaii-Aleutian Time</option>
                                <option value="Pacific/Honolulu">Hawaii Time</option>
                                <option value="Europe/London">London / GMT / BST</option>
                                <option value="Africa/Lagos">Lagos / WAT</option>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Entering a time below will be interpreted as being in this timezone.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="startsAt">Start Date & Time *</Label>
                                <Input
                                    id="startsAt"
                                    name="startsAt"
                                    type="datetime-local"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endsAt">End Date & Time</Label>
                                <Input
                                    id="endsAt"
                                    name="endsAt"
                                    type="datetime-local"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={4}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="isRecurring"
                                    name="isRecurring"
                                    checked={isRecurring}
                                    onChange={(e) => setIsRecurring(e.target.checked)}
                                />
                                <Label htmlFor="isRecurring" className="font-medium">
                                    This is a recurring event
                                </Label>
                            </div>
                            {isRecurring && (
                                <div id="recurring-options" className="space-y-4 pl-7">
                                    <div className="space-y-2">
                                        <Label htmlFor="frequency">Frequency</Label>
                                        <Select name="frequency" id="frequency">
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="recurrenceEndDate">Recurrence End Date</Label>
                                        <Input
                                            id="recurrenceEndDate"
                                            name="recurrenceEndDate"
                                            type="date"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="registrationEnabled"
                                    name="registrationEnabled"
                                />
                                <Label htmlFor="registrationEnabled" className="font-medium">
                                    Registration Enabled
                                </Label>
                            </div>
                            <div className="pl-7">
                                <Label htmlFor="maxRegistrations" className="mb-2 block">Max Registrations (Optional)</Label>
                                <Input
                                    id="maxRegistrations"
                                    name="maxRegistrations"
                                    type="number"
                                    placeholder="No limit"
                                    className="w-32"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Link
                                href="/admin/events"
                                className={buttonVariants({ variant: "ghost" })}
                            >
                                Cancel
                            </Link>
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Event"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
