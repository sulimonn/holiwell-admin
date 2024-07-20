export async function getCourse(type) {
  const response = await fetch(`/api/courses/course-type/${type}`);
  const data = await response.json();
  return data;
}
