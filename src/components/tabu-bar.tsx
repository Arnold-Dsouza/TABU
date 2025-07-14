
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Martini, Calendar, Clock, XCircle, MapPin, PartyPopper, CalendarOff, Check, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

const schedule = [
    { day: 'Friday', hours: '8:00 PM onwards' },
];

const upcomingEvents = [
    { title: 'Karaoke Night', date: 'August 16, 2024', time: '9:00 PM', location: 'Main Bar Area' },
];

const passedEvents = [
    { title: 'Oktoberfest Pre-party', date: 'July 26, 2024' },
];

export default function TabuBar() {
    return (
        <div className="flex flex-col items-center justify-start p-4 md:p-8 gap-8 w-full">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="text-center bg-muted/30">
                    <div className="flex justify-center items-center gap-3 mb-2">
                        <Martini className="h-10 w-10 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline tracking-tight">
                            Tabu Bar
                        </CardTitle>
                    </div>
                    <CardDescription className="text-lg">Opening Hours</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <ul className="space-y-4">
                        {schedule.map((item) => (
                            <li key={item.day} className="flex items-center justify-between p-4 bg-background rounded-lg shadow-sm border border-border/50 hover:border-primary/50 hover:bg-muted/50">
                                <div className="flex items-center gap-4">
                                    <Calendar className="h-6 w-6 text-primary/80" />
                                    <span className="text-lg font-medium">{item.day}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-lg font-mono text-foreground">
                                        {item.hours}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Separator className="my-4 w-full max-w-2xl" />

             <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3">
                         <PartyPopper className="h-8 w-8 text-primary" />
                        <CardTitle className="text-2xl font-bold font-headline">Upcoming Events</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {upcomingEvents.length > 0 ? (
                        <ul className="space-y-4">
                            {upcomingEvents.map((event) => (
                                <li key={event.title} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-background rounded-lg border border-border/50">
                                    <span className="font-semibold text-lg">{event.title}</span>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 sm:mt-0">
                                        <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {event.date}</div>
                                        <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {event.time}</div>
                                        <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.location}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground text-center">No upcoming events scheduled.</p>
                    )}
                </CardContent>
            </Card>

            <Card className="w-full max-w-2xl shadow-lg opacity-70">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <CalendarOff className="h-8 w-8 text-muted-foreground" />
                        <CardTitle className="text-2xl font-bold font-headline">Past Events</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                     {passedEvents.length > 0 ? (
                        <ul className="space-y-3">
                            {passedEvents.map((event) => (
                                <li key={event.title} className="flex items-center gap-3 text-muted-foreground">
                                    <Check className="h-5 w-5 text-green-500" />
                                    <span className="flex-1">{event.title}</span>
                                    <span className="text-sm">{event.date}</span>
                                </li>
                            ))}
                        </ul>
                     ) : (
                        <p className="text-muted-foreground text-center">No past events to show.</p>
                     )}
                </CardContent>
            </Card>

            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Gift className="h-8 w-8 text-primary" />
                        <CardTitle className="text-2xl font-bold font-headline">Private Parties</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        To rent the bar for a private party, please contact XYZ.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
