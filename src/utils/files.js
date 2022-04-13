// TODO: rename jadi `fileToBase64` biar lebih general...
// ...tapi pastikan juga yang mereferensi ini di-rename juga.
// Karena ini ternyata bisa dipakai buat semua jenis file, gak cuma image
async function imageToBase64(imageFileRaw) {
  if (!imageFileRaw) {
    return;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFileRaw);
    reader.onload = () => {
      const baseURL = reader.result;
      resolve(baseURL);
    };
  });
}

export default { imageToBase64 };
