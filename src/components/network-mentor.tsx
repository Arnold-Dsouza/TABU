
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, User, Pencil, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { adminAccess } from "@/lib/admins";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import type { PageContent, MentorBuilding, Mentor } from "@/lib/types";
import { subscribeToPageContent, updatePageContent } from "@/lib/firestore-service";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

const PAGE_ID = 'networkMentor';

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

export default function NetworkMentor() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [content, setContent] = useState<PageContent | null>(null);
    const [editableContent, setEditableContent] = useState<PageContent | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const user = localStorage.getItem('laundryUser');
        if (user) {
            const aptNumber = user.replace('Apt ', '');
            setIsAdmin(adminAccess.networkMentor.includes(aptNumber));
        }

        const unsubscribe = subscribeToPageContent(PAGE_ID, (data) => {
            setContent(data);
            setEditableContent(JSON.parse(JSON.stringify(data)));
        });

        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        if (!editableContent) return;
        try {
            await updatePageContent(PAGE_ID, editableContent);
            toast({ title: "Success", description: "Content updated successfully." });
            setIsEditDialogOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to update content.", variant: "destructive" });
        }
    };
    
    const handleMentorChange = (buildingIndex: number, mentorIndex: number, field: keyof Mentor, value: string) => {
        setEditableContent(prev => {
            if (!prev || !prev.mentorData) return null;
            const newContent = { ...prev };
            const newMentorData = [...newContent.mentorData!];
            newMentorData[buildingIndex].mentors[mentorIndex] = {
                ...newMentorData[buildingIndex].mentors[mentorIndex],
                [field]: value
            };
            newContent.mentorData = newMentorData;
            return newContent;
        });
    };

    const handleBuildingChange = (buildingIndex: number, field: keyof MentorBuilding, value: string) => {
        setEditableContent(prev => {
            if (!prev || !prev.mentorData) return null;
            const newContent = { ...prev };
            const newMentorData = [...newContent.mentorData!];
            newMentorData[buildingIndex] = {...newMentorData[buildingIndex], [field]: value};
            newContent.mentorData = newMentorData;
            return newContent;
        });
    }

    const formatPhoneNumber = (number: string) => number.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');

    if (!content) {
        return <NetworkMentorSkeleton />;
    }

    return (
        <div className="flex flex-col items-center justify-start p-4 md:p-8 gap-8 w-full">
            <Card className="w-full max-w-2xl shadow-lg relative">
                {isAdmin && (
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="absolute top-4 right-4">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit Details</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader><DialogTitle>Edit Network Mentors</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                {editableContent?.mentorData?.map((building, buildingIndex) => (
                                    <div key={building.id} className="p-4 border rounded-lg space-y-4">
                                        <div>
                                            <Label>Building Name</Label>
                                            <Input value={building.building} onChange={e => handleBuildingChange(buildingIndex, 'building', e.target.value)} />
                                        </div>
                                        {building.mentors.map((mentor, mentorIndex) => (
                                            <div key={mentor.id} className="p-2 border rounded-md space-y-2">
                                                <Label>Mentor Name</Label>
                                                <Input value={mentor.name} onChange={e => handleMentorChange(buildingIndex, mentorIndex, 'name', e.target.value)} />
                                                <Label>Mentor Number</Label>
                                                <Input value={mentor.number} onChange={e => handleMentorChange(buildingIndex, mentorIndex, 'number', e.target.value)} />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSave}>Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
                <CardHeader className="text-center bg-muted/30">
                    <div className="flex justify-center items-center gap-3 mb-2"><Users className="h-10 w-10 text-primary" /><CardTitle className="text-3xl font-bold font-headline tracking-tight">Network Mentors</CardTitle></div>
                    <CardDescription className="text-lg">Your friendly points of contact for network-related issues.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {content.mentorData?.map((building, index) => (
                            <div key={building.id}>
                                <div className="flex items-center gap-3 mb-4"><Building className="h-6 w-6 text-primary/80" /><h3 className="text-xl font-semibold">{building.building}</h3></div>
                                <ul className="space-y-3 pl-9">
                                    {building.mentors.map((mentor) => (
                                        <li key={mentor.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3"><User className="h-5 w-5 text-muted-foreground" /><span className="text-lg">{mentor.name}</span></div>
                                            <a href={`https://wa.me/${mentor.number}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground mt-1 sm:mt-0 pl-8 sm:pl-0 hover:text-primary transition-colors">
                                                <WhatsappIcon className="h-5 w-5 text-green-500" /><span>{formatPhoneNumber(mentor.number)}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                {index < content.mentorData!.length - 1 && <Separator className="mt-6" />}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function NetworkMentorSkeleton() {
    return (
        <div className="flex flex-col items-center justify-start p-4 md:p-8 gap-8 w-full">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="text-center bg-muted/30">
                    <div className="flex justify-center items-center gap-3 mb-2"><Users className="h-10 w-10 text-primary" /><CardTitle className="text-3xl font-bold font-headline tracking-tight">Network Mentors</CardTitle></div>
                    <CardDescription className="text-lg">Your friendly points of contact for network-related issues.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i}>
                                <div className="flex items-center gap-3 mb-4"><Skeleton className="h-6 w-6 rounded-full" /><Skeleton className="h-6 w-40" /></div>
                                <ul className="space-y-3 pl-9">
                                    <li><Skeleton className="h-5 w-full" /></li>
                                    <li><Skeleton className="h-5 w-full" /></li>
                                </ul>
                                <Separator className="mt-6" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
