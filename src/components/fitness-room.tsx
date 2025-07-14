
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dumbbell } from "lucide-react";

const schedule = [
    { day: 'Monday', hours: '6:00 AM - 10:00 PM' },
    { day: 'Tuesday', hours: '6:00 AM - 10:00 PM' },
    { day: 'Wednesday', hours: '6:00 AM - 10:00 PM' },
    { day: 'Thursday', hours: '6:00 AM - 10:00 PM' },
    { day: 'Friday', hours: '6:00 AM - 9:00 PM' },
    { day: 'Saturday', hours: '8:00 AM - 8:00 PM' },
    { day: 'Sunday', hours: '8:00 AM - 6:00 PM' },
];

export default function FitnessRoom() {
    return (
        <div className="flex justify-center items-start p-4 md:p-8">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                        <Dumbbell className="h-8 w-8 text-primary" />
                        <span>Fitness Room Schedule</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">Day</TableHead>
                                <TableHead>Opening Hours</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {schedule.map((item) => (
                                <TableRow key={item.day}>
                                    <TableCell className="font-medium">{item.day}</TableCell>
                                    <TableCell>{item.hours}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
