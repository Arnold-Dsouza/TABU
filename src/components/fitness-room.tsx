
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Calendar, Clock, XCircle, Check, MapPin, PartyPopper, CalendarOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

const schedule = [
    { day: 'Tuesday', hours: '6:00 PM - 8:00 PM' },
    { day: 'Friday', hours: '6:00 PM - 8:00 PM' },
    { day: 'Sunday', hours: '6:00 PM - 8:00 PM' },
];

const upcomingEvents = [
    { title: 'Yoga Session', date: 'August 5, 2024', time: '7:00 PM', location: 'Main Hall' },
    { title: 'Cardio Challenge', date: 'August 12, 2024', time: '6:30 PM', location: 'Fitness Room' },
];

const passedEvents = [
    { title: 'Spinning Marathon', date: 'July 20, 2024' },
    { title: 'Weightlifting Workshop', date: 'July 15, 2024' },
];

export default function FitnessRoom() {
    return (
        <div className="flex flex-col items-center justify-start p-4 md:p-8 gap-8 w-full">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="text-center bg-muted/30">
                    <div className="flex justify-center items-center gap-3 mb-2">
                        <Dumbbell className="h-10 w-10 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline tracking-tight">
                            Fitness Room
                        </CardTitle>
                    </div>
                    <CardDescription className="text-lg">Opening Hours</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <ul className="space-y-4">
                        {schedule.map((item) => {
                            const isClosed = item.hours === 'Closed';
                            return (
                                <li key={item.day} className={cn(
                                    "flex items-center justify-between p-4 bg-background rounded-lg shadow-sm border border-border/50 transition-all",
                                    isClosed ? "opacity-60" : "hover:border-primary/50 hover:bg-muted/50"
                                )}>
                                    <div className="flex items-center gap-4">
                                        <Calendar className={cn("h-6 w-6", isClosed ? "text-muted-foreground" : "text-primary/80")} />
                                        <span className="text-lg font-medium">{item.day}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {isClosed ? (
                                            <XCircle className="h-5 w-5 text-muted-foreground" />
                                        ) : (
                                            <Clock className="h-5 w-5 text-muted-foreground" />
                                        )}
                                        <span className={cn(
                                            "text-lg font-mono",
                                            isClosed ? "text-muted-foreground" : "text-foreground"
                                        )}>
                                            {item.hours}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
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
                    <ul className="space-y-3">
                        {passedEvents.map((event) => (
                            <li key={event.title} className="flex items-center gap-3 text-muted-foreground">
                                <Check className="h-5 w-5 text-green-500" />
                                <span className="flex-1">{event.title}</span>
                                <span className="text-sm">{event.date}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
