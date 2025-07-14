
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Calendar, Clock, XCircle, MapPin, PartyPopper, CalendarOff, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

const schedule = [
    { day: 'Monday - Friday', hours: '8:00 AM - 3:00 PM' },
    { day: 'Saturday - Sunday', hours: 'Closed' },
];

const menu = [
    { category: 'Hot Drinks', items: ['Coffee', 'Tea', 'Hot Chocolate'] },
    { category: 'Cold Drinks', items: ['Iced Coffee', 'Juice', 'Soda'] },
    { category: 'Food', items: ['Sandwich of the Day', 'Salad Bowl', 'Daily Soup'] },
];

const upcomingEvents = [
    { title: 'Taco Tuesday', date: 'August 13, 2024', time: '12:00 PM', location: 'Cafeteria' },
];

const passedEvents = [
    { title: 'Pancake Breakfast', date: 'July 9, 2024' },
];

export default function TabuCafeteria() {
    return (
        <div className="flex flex-col items-center justify-start p-4 md:p-8 gap-8 w-full">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="text-center bg-muted/30">
                    <div className="flex justify-center items-center gap-3 mb-2">
                        <Utensils className="h-10 w-10 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline tracking-tight">
                            Tabu Cafeteria
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
                        <BookOpen className="h-8 w-8 text-primary" />
                        <CardTitle className="text-2xl font-bold font-headline">Menu</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {menu.map((category) => (
                            <div key={category.category}>
                                <h3 className="font-semibold text-lg mb-2">{category.category}</h3>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {category.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

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
