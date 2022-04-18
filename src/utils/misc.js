function sleep(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

/**
 * Untuk mengkonversi data dari input form yang berupa string jadi angka.
 * @param {String|Number} input Idealnya angka dalam bentuk string seperti dari form input.
 * @param {Number|any} fallback Nilai custom jika yang diinput tidak bisa dikonversi jadi angka.
 * @returns {Number|fallback} Konversi ke angka atau nilai apapun dari fallback.
 */
function convertAsNumber(input, fallback = 0) {
  const payloadAsNumber = Number(input);
  if (isNaN(payloadAsNumber)) {
    return fallback;
  }
  return payloadAsNumber;
}

export default { sleep, convertAsNumber };
