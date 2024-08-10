import { apiSlice } from './apiSlice';

const course = apiSlice.injectEndpoints({
  tagTypes: ['Courses'],
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: (sotrOption) => `/courses/all${sotrOption ? `?sort_by=${sotrOption}` : ''}`,
      providesTags: ['Courses'],
    }),
    getCourseByType: builder.query({
      query: (type) => `/courses/course-type/${type}`,
      providesTags: ['Courses'],
    }),
    getCourse: builder.query({
      query: (id) => `/courses/${id}`,
      providesTags: ['Courses'],
    }),
    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Courses'],
    }),
    addCourse: builder.mutation({
      query: (data) => ({
        url: '/courses/create',
        method: 'POST',
        body: data,
      }),
    }),
    getLesson: builder.query({
      query: (id) => `/lessons/${id}`,
      providesTags: ['Lesson'],
    }),
    editLesson: builder.mutation({
      query: ({ id, data }) => ({
        url: `/lessons/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteLesson: builder.mutation({
      query: (id) => ({
        url: `/lessons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lesson'],
    }),
    addLesson: builder.mutation({
      query: (data) => ({
        url: '/lessons/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Lesson'],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useGetLessonQuery,
  useGetCourseByTypeQuery,
  useEditCourseMutation,
  useDeleteCourseMutation,
  useEditLessonMutation,
  useDeleteLessonMutation,
  useAddCourseMutation,
  useAddLessonMutation,
} = course;

export default course;
