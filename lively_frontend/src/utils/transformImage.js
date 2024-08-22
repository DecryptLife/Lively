export default function transformImage(e) {
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
        resolve([fileObj.name, reader.result]);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    }
  });
}
