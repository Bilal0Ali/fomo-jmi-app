import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';

export interface Answer {
  answerText: string;
  answeredBy: string; // user id
  timestamp: Timestamp;
}

export interface Doubt {
  id?: string; // Optional for when creating a new doubt
  questionText: string;
  subject: string;
  askedBy: string; // user id
  status: 'pending' | 'resolved';
  answers: Answer[];
  timestamp: Timestamp;
}

const doubtsCollection = collection(db, 'doubts');

export async function createDoubt(doubtData: Omit<Doubt, 'id' | 'timestamp' | 'status' | 'answers'>): Promise<string> {
  const newDoubtRef = await addDoc(doubtsCollection, {
    ...doubtData,
    status: 'pending',
    answers: [],
    timestamp: Timestamp.now(),
  });
  return newDoubtRef.id;
}

export async function getDoubtById(id: string): Promise<Doubt | null> {
  const doubtDoc = await getDoc(doc(doubtsCollection, id));
  if (doubtDoc.exists()) {
    return { id: doubtDoc.id, ...doubtDoc.data() } as Doubt;
  }
  return null;
}

export async function queryDoubtsBySubject(subject: string): Promise<Doubt[]> {
  const q = query(doubtsCollection, where('subject', '==', subject), orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Doubt));
}

export async function queryDoubtsByAskedBy(askedBy: string): Promise<Doubt[]> {
  const q = query(doubtsCollection, where('askedBy', '==', askedBy), orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Doubt));
}

export async function getAllDoubts(): Promise<Doubt[]> {
  const q = query(doubtsCollection, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Doubt));
}

export async function updateDoubt(id: string, updates: Partial<Omit<Doubt, 'id'>>): Promise<void> {
  await updateDoc(doc(doubtsCollection, id), updates as DocumentData);
}

export async function addAnswerToDoubt(doubtId: string, answer: Omit<Answer, 'timestamp'>): Promise<void> {
    const doubtRef = doc(doubtsCollection, doubtId);
    const doubtDoc = await getDoc(doubtRef);

    if (doubtDoc.exists()) {
        const currentAnswers = doubtDoc.data()?.answers || [];
        const newAnswer: Answer = {
            ...answer,
            timestamp: Timestamp.now()
        };
        await updateDoc(doubtRef, {
            answers: [...currentAnswers, newAnswer]
        });
    } else {
        throw new Error("Doubt not found");
    }
}