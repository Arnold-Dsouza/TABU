
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, User, Pencil } from "lucide-react";
import { Separator } from "./ui/separator";
import { adminApartmentNumbers } from "@/lib/admins";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

const mentorData = [
    {
        building: 'Building 58',
        mentors: [
            { name: 'Alice Johnson', number: '01234567890' },
            { name: 'Bob Williams', number: '01234567891' },
        ]
    },
    {
        building: 'Building 60',
        mentors: [
            { name: 'Charlie Brown', number: '01234567892' },
            { name: 'Diana Miller', number: '01234567893' },
        ]
    },
    {
        building: 'Building 62',
        mentors: [
            { name: 'Eve Davis', number: '01234567894' },
            { name: 'Frank Garcia', number: '01234567895' },
        ]
    },
    {
        building: 'Building 64',
        mentors: [
            { name: 'Grace Rodriguez', number: '01234567896' },
            { name: 'Heidi Martinez', number: '01234567897' },
        ]
    },
];

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);


export default function NetworkMentor() {
    const [isAdmin, setIsAdmin] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const user = localStorage.getItem('laundryUser');
        if (user) {
            const aptNumber = user.replace('Apt ', '');
            setIsAdmin(adminApartmentNumbers.includes(aptNumber));
        }
    }, []);

    const handleEditClick = () => {
        toast({
            title: "Edit Mode",
            description: "Editing functionality is not yet implemented.",
        });
    }

    // A helper function to format the number for display
    const formatPhoneNumber = (number: string) => {
        return number.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
    };

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
                                            <a 
                                                href={`https://wa.me/${mentor.number}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-muted-foreground mt-1 sm:mt-0 pl-8 sm:pl-0 hover:text-primary transition-colors"
                                            >
                                                <WhatsappIcon className="h-5 w-5 text-green-500" />
                                                <span>{formatPhoneNumber(mentor.number)}</span>
                                            </a>
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
