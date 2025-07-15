
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, User, Phone } from "lucide-react";
import { Separator } from "./ui/separator";

const mentorData = [
    {
        building: 'Building 58',
        mentors: [
            { name: 'Alice Johnson', number: '0123 456 7890' },
            { name: 'Bob Williams', number: '0123 456 7891' },
        ]
    },
    {
        building: 'Building 60',
        mentors: [
            { name: 'Charlie Brown', number: '0123 456 7892' },
            { name: 'Diana Miller', number: '0123 456 7893' },
        ]
    },
    {
        building: 'Building 62',
        mentors: [
            { name: 'Eve Davis', number: '0123 456 7894' },
            { name: 'Frank Garcia', number: '0123 456 7895' },
        ]
    },
    {
        building: 'Building 64',
        mentors: [
            { name: 'Grace Rodriguez', number: '0123 456 7896' },
            { name: 'Heidi Martinez', number: '0123 456 7897' },
        ]
    },
];

export default function NetworkMentor() {
    return (
        <div className="flex flex-col items-center justify-start p-4 md:p-8 gap-8 w-full">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="text-center bg-muted/30">
                    <div className="flex justify-center items-center gap-3 mb-2">
                        <Users className="h-10 w-10 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline tracking-tight">
                            Network Mentors
                        </CardTitle>
                    </div>
                    <CardDescription className="text-lg">
                        Your friendly points of contact for network-related issues.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {mentorData.map((building, index) => (
                            <div key={building.building}>
                                <div className="flex items-center gap-3 mb-4">
                                    <Building className="h-6 w-6 text-primary/80" />
                                    <h3 className="text-xl font-semibold">{building.building}</h3>
                                </div>
                                <ul className="space-y-3 pl-9">
                                    {building.mentors.map((mentor) => (
                                        <li key={mentor.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                                <span className="text-lg">{mentor.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground mt-1 sm:mt-0 pl-8 sm:pl-0">
                                                <Phone className="h-4 w-4" />
                                                <span>{mentor.number}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {index < mentorData.length - 1 && <Separator className="mt-6" />}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
