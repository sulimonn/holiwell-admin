export function getCroppedImg(imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const maxSize = Math.max(image.width, image.height);
      const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

      // Set canvas width to safe area to ensure we can rotate around the center.
      canvas.width = safeArea;
      canvas.height = safeArea;

      ctx.drawImage(image, safeArea / 2 - image.width * 0.5, safeArea / 2 - image.height * 0.5);

      const data = ctx.getImageData(0, 0, safeArea, safeArea);

      // Set canvas size to the cropped image size.
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // Draw the cropped image.
      ctx.putImageData(
        data,
        0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
        0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'croppedImage.jpeg', {
            type: 'image/jpeg',
          });
          resolve(file); // Return the File object
        } else {
          reject(new Error('Crop failed'));
        }
      }, 'image/jpeg');
    };
    image.onerror = (err) => reject(err);
  });
}
