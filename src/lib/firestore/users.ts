import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  profilePictureURL: string | null;
  class: string | null;
  semester: string | null;
  karmaPoints: number;
}

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  } else {
    return null;
  }
};

export const createUserProfile = async (
  uid: string,
  data: Partial<Omit<UserProfile, "uid">>
): Promise<void> => {
  const userDocRef = doc(db, "users", uid);
  const newUserProfile: UserProfile = {
    uid,
    displayName: data.displayName || null,
    email: data.email || null,
    profilePictureURL: data.profilePictureURL || null,
    class: data.class || null,
    semester: data.semester || null,
    karmaPoints: data.karmaPoints || 0,
  };
  await setDoc(userDocRef, newUserProfile);
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<Omit<UserProfile, "uid">>
): Promise<void> => {
  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, data as DocumentData);
};