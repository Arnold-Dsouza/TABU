
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Calendar, Clock, XCircle, MapPin, PartyPopper, CalendarOff, BookOpen, Check, Gift, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { adminAccess } from "@/lib/admins";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

const schedule = [
    { day: 'Wednesday', hours: '5:00 PM - 8:00 PM' },
    { day: 'Sunday', hours: '5:00 PM - 8:00 PM' },
];

const specialMenu = [
    { name: 'Mango Cheesecake', price: '€ 2.5' },
    { name: 'Fruit Popsicle Eis', price: '€ 1' },
    { name: 'Spaghetti Icecream', price: '€ 1.5' },
    { name: 'Vanilla Berry Sunday', price: '€ 2' },
];

const usualMenu = [
    { name: 'Pommes', price: '€ 2 / € 1.5' },
    { name: 'Chicken Wings', price: '2-3 Pcs' },
    { name: 'Iced Coffee Latte', price: '€ 1.5' },
    { name: 'Warm Tea', price: '€ 0.50' },
    { name: 'Desi Chai', price: '€ 1.5' },
    { name: 'Pan Cakes + Berries', price: '€ 2' },
    { name: 'Brownies', price: '1.5 - 2 Pcs' },
    { name: 'Peach ice tea', price: '€ 1' },
];

const upcomingEvents = [
    { title: 'Taco Tuesday', date: 'August 13, 2024', time: '12:00 PM', location: 'Cafeteria' },
];

const passedEvents = [
    { title: 'Pancake Breakfast', date: 'July 9, 2024' },
];

export default function TabuCafeteria() {
    const [isAdmin, setIsAdmin] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const user = localStorage.getItem('laundryUser');
        if (user) {
            const aptNumber = user.replace('Apt ', '');
            setIsAdmin(adminAccess.tabuCafeteria.includes(aptNumber));
        }
    }, []);

    const handleEditClick = () => {
        toast({
            title: "Edit Mode",
            description: "Editing functionality is not yet implemented.",
        });
    }

    return (
        <div className="flex flex-col items-center justify-start p-4 md:p-8 gap-8 w-full">
            <Card className="w-full max-w-2xl shadow-lg relative">
                 {isAdmin && (
                    <Button onClick={handleEditClick} variant="outline" size="icon" className="absolute top-4 right-4">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit Details</span>
                    </Button>
                )}
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

            <Card className="w-full max-w-4xl shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <CardTitle className="text-2xl font-bold font-headline">Menu for the Day</CardTitle>
                    </div>
                    <CardDescription>Seasonal, cold, and made with love</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-center text-white bg-yellow-500 rounded-md py-2">SPECIAL MENU</h3>
                            <ul className="space-y-3">
                                {specialMenu.map((item) => (
                                    <li key={item.name} className="flex justify-between items-baseline border-b border-dashed pb-2">
                                        <span className="font-medium">{item.name}</span>
                                        <span className="font-mono text-muted-foreground">{item.price}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                             <h3 className="text-xl font-bold mb-4 text-center text-white bg-yellow-500 rounded-md py-2">USUAL MENU</h3>
                             <ul className="space-y-3">
                                {usualMenu.map((item) => (
                                    <li key={item.name} className="flex justify-between items-baseline border-b border-dashed pb-2">
                                        <span className="font-medium">{item.name}</span>
                                        <span className="font-mono text-muted-foreground">{item.price}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
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
                        To rent the cafeteria for a private party, please contact ABC.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
