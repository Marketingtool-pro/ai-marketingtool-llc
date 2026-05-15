export function generateId() {
  return `${Date.now()}${Math.floor(Math.random() * 1e6)}`;
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to convert file to base64 string.'));
      }
    };
    reader.onerror = (error) => {
      reject(error || new Error('Unknown FileReader error.'));
    };
  });
}
