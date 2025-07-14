
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Calendar, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const schedule = [
    { day: 'Monday', hours: 'Closed' },
    { day: 'Tuesday', hours: '6:00 PM - 8:00 PM' },
    { day: 'Wednesday', hours: 'Closed' },
    { day: 'Thursday', hours: 'Closed' },
    { day: 'Friday', hours: '6:00 PM - 8:00 PM' },
    { day: 'Saturday', hours: 'Closed' },
    { day: 'Sunday', hours: '6:00 PM - 8:00 PM' },
];

export default function FitnessRoom() {
    return (
        <div className="flex justify-center items-start p-4 md:p-8">
            <Card className="w-full max-w-2xl shadow-lg overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
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
        </div>
    );
}
