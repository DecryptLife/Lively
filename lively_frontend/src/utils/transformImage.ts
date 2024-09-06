import { ChangeEvent } from "react";

export default function transformImage(
  e: ChangeEvent<HTMLInputElement>
): Promise<[File, string | ArrayBuffer | null]> {
  return new Promise((resolve, reject) => {
    const fileObj = e.target.files && e.target.files[0];

    console.log("In file obj: ", fileObj);

    if (!fileObj) {
      reject(new Error("No file selected"));
    } else {
      const reader = new FileReader();

      reader.readAsDataURL(fileObj);
      reader.onloadend = () => {
        console.log("Reader result: ", reader.result);
        resolve([fileObj, reader.result as string]);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    }
  });
}
