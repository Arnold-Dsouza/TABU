
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Calendar, Clock, XCircle, MapPin, PartyPopper, CalendarOff, BookOpen, Check, Gift, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { adminAccess } from "@/lib/admins";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import type { PageContent } from "@/lib/types";
import { subscribeToPageContent } from "@/lib/firestore-service";
import { updatePageContent } from "@/app/actions";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

const PAGE_ID = 'teaRoom';

export default function TeaRoom() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [content, setContent] = useState<PageContent | null>(null);
    const [editableContent, setEditableContent] = useState<PageContent | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const user = localStorage.getItem('laundryUser');
        if (user) {
            const aptNumber = user.replace('Apt ', '');
            setIsAdmin(adminAccess.teaRoom.includes(aptNumber));
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
    
    const handleFieldChange = (section: keyof PageContent, index: number, field: string, value: string) => {
        setEditableContent(prev => {
            if (!prev) return null;
            const newContent = { ...prev };
            const sectionData = newContent[section] as any[];
            if (sectionData && sectionData[index]) {
                sectionData[index] = { ...sectionData[index], [field]: value };
            }
            return newContent;
        });
    };
    
    const handleAddItem = (section: keyof PageContent) => {
        setEditableContent(prev => {
            if (!prev) return null;
            const newContent = { ...prev };
            const sectionData = newContent[section] as any[] || [];
            let newItem;
            if (section === 'schedule') newItem = { day: '', hours: '' };
            else if (section === 'specialMenu' || section === 'usualMenu') newItem = { id: `new-${Date.now()}`, name: '', price: '' };
            else if (section === 'upcomingEvents' || section === 'passedEvents') newItem = { id: `new-${Date.now()}`, title: '', date: '', time: '', location: '' };
            else return prev;
            newContent[section] = [...sectionData, newItem] as any;
            return newContent;
        });
    };

    const handleRemoveItem = (section: keyof PageContent, index: number) => {
        setEditableContent(prev => {
            if (!prev) return null;
            const newContent = { ...prev };
            const sectionData = newContent[section] as any[];
            if (sectionData) sectionData.splice(index, 1);
            return newContent;
        });
    };

    const handleSimpleFieldChange = (field: 'privatePartiesContact', value: string) => {
        setEditableContent(prev => prev ? { ...prev, [field]: value } : null);
    };

    if (!content) {
        return <TeaRoomSkeleton />;
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
                            <DialogHeader><DialogTitle>Edit Tea Room Details</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">Opening Hours</h3>
                                    {editableContent?.schedule?.map((item, index) => (
                                        <div key={index} className="flex items-end gap-2">
                                            <div className="flex-grow"><Label>Day</Label><Input value={item.day} onChange={e => handleFieldChange('schedule', index, 'day', e.target.value)} /></div>
                                            <div className="flex-grow"><Label>Hours</Label><Input value={item.hours} onChange={e => handleFieldChange('schedule', index, 'hours', e.target.value)} /></div>
                                            <Button variant="destructive" size="icon" onClick={() => handleRemoveItem('schedule', index)}><Trash2 className="h-4 w-4"/></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" onClick={() => handleAddItem('schedule')}>Add Hour</Button>
                                </div>
                                <Separator/>
                                <div className="space-y-2"><h3 className="font-semibold text-lg">Special Menu</h3>
                                {editableContent?.specialMenu?.map((item, index) => (
                                    <div key={item.id} className="flex items-end gap-2">
                                        <div className="flex-grow"><Label>Name</Label><Input value={item.name} onChange={e => handleFieldChange('specialMenu', index, 'name', e.target.value)}/></div>
                                        <div className="w-1/4"><Label>Price</Label><Input value={item.price} onChange={e => handleFieldChange('specialMenu', index, 'price', e.target.value)}/></div>
                                        <Button variant="destructive" size="icon" onClick={() => handleRemoveItem('specialMenu', index)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={() => handleAddItem('specialMenu')}>Add Special Item</Button></div>
                                <Separator/>
                                <div className="space-y-2"><h3 className="font-semibold text-lg">Usual Menu</h3>
                                {editableContent?.usualMenu?.map((item, index) => (
                                    <div key={item.id} className="flex items-end gap-2">
                                        <div className="flex-grow"><Label>Name</Label><Input value={item.name} onChange={e => handleFieldChange('usualMenu', index, 'name', e.target.value)}/></div>
                                        <div className="w-1/4"><Label>Price</Label><Input value={item.price} onChange={e => handleFieldChange('usualMenu', index, 'price', e.target.value)}/></div>
                                        <Button variant="destructive" size="icon" onClick={() => handleRemoveItem('usualMenu', index)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={() => handleAddItem('usualMenu')}>Add Usual Item</Button></div>
                                <Separator/>
                                <div className="space-y-2"><h3 className="font-semibold text-lg">Upcoming Events</h3>
                                {editableContent?.upcomingEvents?.map((event, index) => (
                                    <div key={event.id} className="p-2 border rounded-md space-y-2 relative">
                                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleRemoveItem('upcomingEvents', index)}><Trash2 className="h-4 w-4"/></Button>
                                        <Label>Title</Label><Input value={event.title} onChange={e => handleFieldChange('upcomingEvents', index, 'title', e.target.value)}/>
                                        <Label>Date</Label><Input value={event.date} onChange={e => handleFieldChange('upcomingEvents', index, 'date', e.target.value)}/>
                                        <Label>Time</Label><Input value={event.time} onChange={e => handleFieldChange('upcomingEvents', index, 'time', e.target.value)}/>
                                        <Label>Location</Label><Input value={event.location} onChange={e => handleFieldChange('upcomingEvents', index, 'location', e.target.value)}/>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={() => handleAddItem('upcomingEvents')}>Add Upcoming Event</Button></div>
                                <Separator/>
                                <div className="space-y-2"><h3 className="font-semibold text-lg">Past Events</h3>
                                {editableContent?.passedEvents?.map((event, index) => (
                                    <div key={event.id} className="p-2 border rounded-md space-y-2 relative">
                                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleRemoveItem('passedEvents', index)}><Trash2 className="h-4 w-4"/></Button>
                                        <Label>Title</Label><Input value={event.title} onChange={e => handleFieldChange('passedEvents', index, 'title', e.target.value)}/>
                                        <Label>Date</Label><Input value={event.date} onChange={e => handleFieldChange('passedEvents', index, 'date', e.target.value)}/>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={() => handleAddItem('passedEvents')}>Add Past Event</Button></div>
                                <Separator/>
                                <div className="space-y-2"><Label>Private Parties Contact</Label><Input value={editableContent?.privatePartiesContact || ''} onChange={e => handleSimpleFieldChange('privatePartiesContact', e.target.value)}/></div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSave}>Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
                <CardHeader className="text-center bg-muted/30">
                    <div className="flex justify-center items-center gap-3 mb-2">
                        <Coffee className="h-10 w-10 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline tracking-tight">Tea Room</CardTitle>
                    </div>
                    <CardDescription className="text-lg">Opening Hours</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <ul className="space-y-4">
                        {content.schedule?.map((item) => (
                            <li key={item.day} className="flex items-center justify-between p-4 bg-background rounded-lg shadow-sm border border-border/50 transition-all hover:border-primary/50 hover:bg-muted/50">
                                <div className="flex items-center gap-4"><Calendar className="h-6 w-6 text-primary/80" /><span className="text-lg font-medium">{item.day}</span></div>
                                <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-muted-foreground" /><span className="text-lg font-mono text-foreground">{item.hours}</span></div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Separator className="my-4 w-full max-w-2xl" />

            <Card className="w-full max-w-4xl shadow-lg">
                <CardHeader><div className="flex items-center gap-3"><BookOpen className="h-8 w-8 text-primary" /><CardTitle className="text-2xl font-bold font-headline">Menu of the Day</CardTitle></div><CardDescription>A selection of fine teas and pastries.</CardDescription></CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div><h3 className="text-xl font-bold mb-4 text-center text-white bg-primary/80 rounded-md py-2">SPECIALS</h3><ul className="space-y-3">{content.specialMenu?.map((item) => (<li key={item.id} className="flex justify-between items-baseline border-b border-dashed pb-2"><span className="font-medium">{item.name}</span><span className="font-mono text-muted-foreground">{item.price}</span></li>))}</ul></div>
                        <div><h3 className="text-xl font-bold mb-4 text-center text-white bg-primary/80 rounded-md py-2">REGULARS</h3><ul className="space-y-3">{content.usualMenu?.map((item) => (<li key={item.id} className="flex justify-between items-baseline border-b border-dashed pb-2"><span className="font-medium">{item.name}</span><span className="font-mono text-muted-foreground">{item.price}</span></li>))}</ul></div>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader><div className="flex items-center gap-3"><PartyPopper className="h-8 w-8 text-primary" /><CardTitle className="text-2xl font-bold font-headline">Upcoming Events</CardTitle></div></CardHeader>
                <CardContent>{content.upcomingEvents && content.upcomingEvents.length > 0 ? (<ul className="space-y-4">{content.upcomingEvents.map((event) => (<li key={event.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-background rounded-lg border border-border/50"><span className="font-semibold text-lg">{event.title}</span><div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 sm:mt-0"><div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {event.date}</div><div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {event.time}</div><div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.location}</div></div></li>))}</ul>) : (<p className="text-muted-foreground text-center">No upcoming events scheduled.</p>)}</CardContent>
            </Card>

            <Card className="w-full max-w-2xl shadow-lg opacity-70">
                <CardHeader><div className="flex items-center gap-3"><CalendarOff className="h-8 w-8 text-muted-foreground" /><CardTitle className="text-2xl font-bold font-headline">Past Events</CardTitle></div></CardHeader>
                <CardContent>{content.passedEvents && content.passedEvents.length > 0 ? (<ul className="space-y-3">{content.passedEvents.map((event) => (<li key={event.id} className="flex items-center gap-3 text-muted-foreground"><Check className="h-5 w-5 text-green-500" /><span className="flex-1">{event.title}</span><span className="text-sm">{event.date}</span></li>))}</ul>) : (<p className="text-muted-foreground text-center">No past events to show.</p>)}</CardContent>
            </Card>

            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader><div className="flex items-center gap-3"><Gift className="h-8 w-8 text-primary" /><CardTitle className="text-2xl font-bold font-headline">Private Parties</CardTitle></div></CardHeader>
                <CardContent><p className="text-center text-muted-foreground">To rent the tea room for a private party, please contact {content.privatePartiesContact || 'us'}.</p></CardContent>
            </Card>
        </div>
    );
}

function TeaRoomSkeleton() {
    return (
        <div className="flex flex-col items-center justify-start p-4 md:p-8 gap-8 w-full">
            <Card className="w-full max-w-2xl shadow-lg"><CardHeader className="text-center bg-muted/30"><div className="flex justify-center items-center gap-3 mb-2"><Coffee className="h-10 w-10 text-primary" /><CardTitle className="text-3xl font-bold font-headline tracking-tight">Tea Room</CardTitle></div><CardDescription className="text-lg">Opening Hours</CardDescription></CardHeader><CardContent className="p-6"><div className="space-y-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div></CardContent></Card>
            <Separator className="my-4 w-full max-w-2xl" />
            <Card className="w-full max-w-4xl shadow-lg"><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent><div className="grid md:grid-cols-2 gap-8"><div><Skeleton className="h-10 w-full mb-4" /><Skeleton className="h-8 w-full mb-2" /><Skeleton className="h-8 w-full" /></div><div><Skeleton className="h-10 w-full mb-4" /><Skeleton className="h-8 w-full mb-2" /><Skeleton className="h-8 w-full" /></div></div></CardContent></Card>
            <Card className="w-full max-w-2xl shadow-lg"><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
        </div>
    );
}
