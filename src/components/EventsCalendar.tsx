"use client";

import React, { useMemo, useState } from "react";

interface EventItem {
  id: string | number;
  title: string;
  start_at: string; // ISO string
  description?: string | null;
  category?: string | null;
  location?: string | null;
  registration_required?: boolean | null;
}

interface Props {
  events: EventItem[];
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export default function EventsCalendar({ events }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const [selected, setSelected] = useState<Date | null>(null);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    events.forEach((e) => {
      if (!e.start_at) return;
      const d = new Date(e.start_at);
      const key = d.toISOString().slice(0, 10);
      const arr = map.get(key) || [];
      arr.push(e);
      map.set(key, arr);
    });
    return map;
  }, [events]);

  // build days array for current month (Sunday-first)
  const days: Date[] = useMemo(() => {
    const list: Date[] = [];
    const first = new Date(monthStart);
    const startWeekday = first.getDay();
    // prepend previous month empty days
    for (let i = 0; i < startWeekday; i++) {
      list.push(new Date(NaN));
    }
    for (let d = 1; d <= monthEnd.getDate(); d++) {
      list.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), d));
    }
    return list;
  }, [monthStart, monthEnd]);

  const monthEvents = useMemo(() => {
    const list: EventItem[] = [];
    events.forEach((e) => {
      if (!e.start_at) return;
      const d = new Date(e.start_at);
      if (d >= monthStart && d <= monthEnd) list.push(e);
    });
    // sort by date
    list.sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
    return list;
  }, [events, monthStart, monthEnd]);

  const selectedKey = selected ? selected.toISOString().slice(0, 10) : null;

  const weekEvents = useMemo(() => {
    if (!selected) return [];
    const list: EventItem[] = [];
    const startOfWeek = new Date(selected);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    events.forEach((e) => {
      if (!e.start_at) return;
      const d = new Date(e.start_at);
      if (d >= startOfWeek && d <= endOfWeek) list.push(e);
    });
    // sort by date
    list.sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
    return list;
  }, [events, selected]);

  // If a day is selected, show only that day's events; otherwise show all events for the month
  const displayedEvents = selectedKey ? weekEvents : monthEvents;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{currentDate.toLocaleString([], { month: 'long', year: 'numeric' })}</h3>
        <div className="flex items-center gap-2">
            <button
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                className="p-2 rounded-lg border bg-background hover:bg-muted"
            >
                &lt;
            </button>
            <button
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                className="p-2 rounded-lg border bg-background hover:bg-muted"
            >
                &gt;
            </button>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Click a day to highlight it. Toggle to show only that day&apos;s activities.</p>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
          <div key={d} className="text-xs font-bold text-muted-foreground">{d}</div>
        ))}
        {days.map((d, i) => {
          const isValid = !Number.isNaN(d.getTime());
          const key = isValid ? d.toISOString().slice(0,10) : `empty-${i}`;
          const hasEvents = isValid && eventsByDate.has(key);
          const isSelected = selectedKey === (isValid ? key : null);
          return (
            <button
              key={key}
              onClick={() => isValid && setSelected(new Date(d))}
              className={
                `h-12 p-1 rounded-lg border ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-background'} ${hasEvents ? 'ring-2 ring-primary/30' : ''}`
              }
            >
              {isValid ? d.getDate() : ''}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        {selected && (
          <div className="text-sm text-muted-foreground">Selected: {selected.toLocaleDateString()}</div>
        )}
        {selected && (
          <button className="text-sm text-primary underline" onClick={() => setSelected(null)}>Show full month</button>
        )}
      </div>

      <div>
        <h4 className="font-semibold">
          Activities {selected ? `for the week of ${selected.toLocaleDateString()}` : `for ${currentDate.toLocaleString([], { month: 'long', year: 'numeric' })}`}
        </h4>
        <div className="mt-3 space-y-4">
          {displayedEvents.length === 0 ? (
            <p className="text-muted-foreground">No activities found.</p>
          ) : (
            displayedEvents.map((ev) => {
              const sd = new Date(ev.start_at);
              return (
                <div key={ev.id} className="p-3 border border-border rounded-lg bg-background">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-lg">{ev.title}</div>
                      <div className="text-sm text-muted-foreground">{sd.toLocaleDateString()} • {sd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{ev.location || 'Online'}</div>
                  </div>
                  {ev.description && <p className="mt-2 text-sm text-muted-foreground">{ev.description}</p>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
