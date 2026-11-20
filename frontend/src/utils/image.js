export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPT_ATTR = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";
export const MAX_SIZE_MB = 5;

// Returns an error message, or null if the file is fine.
export function validateImage(file) {
  if (!ALLOWED_TYPES.includes(file.type)) return "Please choose a JPG, JPEG, PNG or WebP image.";
  if (file.size === 0) return "That file is empty.";
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return `Image is too large. Maximum size is ${MAX_SIZE_MB} MB.`;
  return null;
}

// Centre-crops to a square and resizes. Resolves with a data URL.
// Later: upload this (or the original file) to your backend instead.
export function cropImageToSquare(file, size = 256) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      if (!side) return reject(new Error("This image could not be read. Try a different file."));
      const sx = (img.naturalWidth - side) / 2;
      const sy = (img.naturalHeight - side) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff"; // fills transparent PNG areas
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This image could not be read. Try a different file."));
    };
    img.src = url;
  });
}