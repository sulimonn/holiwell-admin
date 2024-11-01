export function debounce(func, wait) {
  let timeout;
  // eslint-disable-next-line func-names
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export function checkMediaType(url) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'webm', 'mkv'];

  const extension = url.split('.').pop().toLowerCase();

  if (imageExtensions.includes(extension)) {
    return 'image';
  }
  if (videoExtensions.includes(extension)) {
    return 'video';
  }
  return 'unknown';
}

export const sortLessonsByLinks = (lessons) => {
  const sortedLessons = [...lessons].sort((a, b) => {
    // Change this logic based on how you want to order them
    const aAfterLinks = a.next_lesson_id;
    const bAfterLinks = b.next_lesson_id;

    return bAfterLinks - aAfterLinks; // Sort in descending order by the number of after links
  });

  return sortedLessons;
};
