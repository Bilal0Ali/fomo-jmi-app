import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase"; // Assuming storage is exported from your firebase.ts

/**
 * Uploads a file to Firebase Cloud Storage.
 * @param file The File object to upload.
 * @param filePath The desired path in the storage bucket (e.g., 'resources/pdfs/my_document.pdf').
 * @returns A Promise that resolves with the download URL of the uploaded file.
 * @throws If the upload fails.
 */
export const uploadFileToStorage = async (file: File, filePath: string): Promise<string> => {
  try {
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to storage:", error);
    throw error;
  }
};

// You can add more types or functions related to storage here if needed.