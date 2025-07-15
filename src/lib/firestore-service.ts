
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, DocumentData } from 'firebase/firestore';
import type { PageContent } from '@/lib/types';
import {
    initialFitnessRoomData,
    initialTeaRoomData,
    initialCafeteriaData,
    initialBarData,
    initialMentorData
} from '@/lib/data';

const initialDataMap: { [key: string]: PageContent } = {
    fitnessRoom: initialFitnessRoomData,
    teaRoom: initialTeaRoomData,
    tabuCafeteria: initialCafeteriaData,
    tabuBar: initialBarData,
    networkMentor: initialMentorData
};

export async function getPageContent(pageId: string): Promise<PageContent> {
    const docRef = doc(db, 'tabu2Content', pageId);
    let docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.log(`No content for ${pageId}, seeding initial data...`);
        const initialData = initialDataMap[pageId];
        if(initialData) {
            await setDoc(docRef, initialData);
            docSnap = await getDoc(docRef);
        } else {
            throw new Error(`No initial data defined for page: ${pageId}`);
        }
    }
    
    return docSnap.data() as PageContent;
}

export function subscribeToPageContent(pageId: string, callback: (data: PageContent) => void) {
    const docRef = doc(db, 'tabu2Content', pageId);
    
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data() as PageContent);
        } else {
            console.log(`No content for ${pageId}, seeding initial data during subscription...`);
             const initialData = initialDataMap[pageId];
            if(initialData) {
                await setDoc(docRef, initialData);
                // The onSnapshot will trigger again automatically after the setDoc
            } else {
                console.error(`No initial data defined for page: ${pageId}`);
            }
        }
    });

    return unsubscribe;
}

export async function updatePageContent(pageId: string, data: Partial<PageContent>) {
    const docRef = doc(db, 'tabu2Content', pageId);
    await setDoc(docRef, data, { merge: true });
}
