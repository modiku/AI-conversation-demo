import { useState, useCallback } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../config/firebase";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = useCallback(
    (file: File, path: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, path);
        const task = uploadBytesResumable(storageRef, file);

        setUploading(true);
        setProgress(0);

        task.on(
          "state_changed",
          (snapshot) => {
            setProgress(
              Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              )
            );
          },
          (error) => {
            setUploading(false);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(task.snapshot.ref);
            setUploading(false);
            setProgress(100);
            resolve(url);
          }
        );
      });
    },
    []
  );

  return { uploadImage, uploading, progress };
}
