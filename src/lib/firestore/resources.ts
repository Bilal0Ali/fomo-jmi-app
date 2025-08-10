import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  DocumentData,
  QuerySnapshot,
  Timestamp,
} from 'firebase/firestore';

export type ResourceCategory = 'Notes' | 'PYQ' | 'Syllabus' | 'Links';

export interface Resource {
  id?: string; // Firestore document ID
  fileName: string;
  fileType: string;
  downloadURL: string;
  uploadedBy: string; // User ID
  subject: string;
  category: ResourceCategory;
  timestamp: Timestamp;
}

import { uploadFile } from '../storage';
import { v4 as uuidv4 } from 'uuid';

const resourcesCollection = collection(db, 'resources');

export const createResource = async (
  file: File,
  resourceData: Omit<Resource, 'id' | 'timestamp' | 'downloadURL' | 'fileType' | 'fileName'>
): Promise<string> => {
  try {
    const filePath = `resources/${resourceData.uploadedBy}/${uuidv4()}-${file.name}`;
    const downloadURL = await uploadFile(file, filePath);
    const docRef = await addDoc(resourcesCollection, {
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};

export const getResources = async (): Promise<Resource[]> => {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(resourcesCollection);
    const resources: Resource[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Resource[];
    return resources;
  } catch (error) {
    console.error('Error getting resources:', error);
    throw error;
  }
};

export const queryResourcesBySubject = async (subject: string): Promise<Resource[]> => {
  try {
    const q = query(resourcesCollection, where('subject', '==', subject));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const resources: Resource[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Resource[];
    return resources;
  } catch (error) {
    console.error('Error querying resources by subject:', error);
    throw error;
  }
};

export const queryResourcesByCategory = async (category: ResourceCategory): Promise<Resource[]> => {
  try {
    const q = query(resourcesCollection, where('category', '==', category));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const resources: Resource[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Resource[];
    return resources;
  } catch (error) {
    console.error('Error querying resources by category:', error);
    throw error;
  }
};

// You can add more query functions as needed (e.g., by uploadedBy)