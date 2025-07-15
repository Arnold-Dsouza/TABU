
'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { PageContent } from '@/lib/types';

export async function updatePageContent(pageId: string, data: PageContent) {
    if (!pageId) {
        throw new Error('A pageId is required to update content.');
    }
    const docRef = doc(db, 'tabu2Content', pageId);
    await setDoc(docRef, data, { merge: true });
}
