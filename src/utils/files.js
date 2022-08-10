async function fileToBase64(fileRaw) {
  if (!fileRaw) {
    return;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileRaw);
    reader.onload = () => {
      const baseURL = reader.result;
      resolve(baseURL);
    };
  });
}

// alias untuk yang masih panggil nama function lama
const imageToBase64 = fileToBase64;

export default { imageToBase64, fileToBase64 };
