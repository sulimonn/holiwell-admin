import { apiSlice } from './apiSlice';
import axiosInstance from './axiosInstance';
import { setUploadProgress } from './snackbar';

const course = apiSlice.injectEndpoints({
  tagTypes: ['Courses', 'Lesson'],
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: (sortOption) => `/courses/all${sortOption ? `?sort_by=${sortOption}` : ''}`,
      providesTags: ['Courses'],
    }),
    getCourseByType: builder.query({
      query: ({ type, sort_by }) =>
        `/courses/course-type/${type}${sort_by ? `?sort_by=${sort_by}` : ''}`,
      providesTags: ['Courses'],
    }),
    fetchAllTypes: builder.query({
      query: () => '/courses/course-type/all',
      providesTags: ['Course'],
    }),
    getCourse: builder.query({
      query: ({ id, sort_by }) => `/courses/${id}?sort_by=${sort_by}`,
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
      invalidatesTags: ['Courses'],
    }),
    getLesson: builder.query({
      query: (id) => `/lessons/${id}`,
      providesTags: ['Lesson'],
    }),
    editLesson: builder.mutation({
      async queryFn({ id, data }, { dispatch, ...props }) {
        const token = localStorage.getItem('authToken');

        try {
          const response = await axiosInstance.patch(`/lessons/${id}`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
              const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              dispatch(setUploadProgress(percentage)); // Dispatch progress
            },
          });

          return { data: response.data };
        } catch (error) {
          return { error: error.response.data || error.message };
        }
      },
      invalidatesTags: ['Lesson', 'Courses'],
    }),
    deleteLesson: builder.mutation({
      query: (id) => ({
        url: `/lessons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lesson', 'Courses'],
    }),
    addLesson: builder.mutation({
      async queryFn(data, { dispatch }) {
        const token = localStorage.getItem('authToken');

        try {
          const response = await axiosInstance.post(`/lessons/create`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
              const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              dispatch(setUploadProgress(percentage)); // Dispatch progress
            },
          });

          return { data: response.data };
        } catch (error) {
          return { error: error.response.data || error.message };
        }
      },
      invalidatesTags: ['Lesson', 'Courses'],
    }),
    addNextLesson: builder.mutation({
      query: ({ lesson_id, link_after_lesson_id }) => ({
        url: `/lessons/link-after/create?lesson_id=${lesson_id}&link_after_lesson_id=${link_after_lesson_id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Lesson', 'Courses'],
    }),
    addPrevLesson: builder.mutation({
      query: ({ lesson_id, link_before_lesson_id }) => ({
        url: `/lessons/link-before/create?lesson_id=${lesson_id}&link_before_lesson_id=${link_before_lesson_id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Lesson', 'Courses'],
    }),
    deleteNextLesson: builder.mutation({
      query: (lesson_id) => ({
        url: `/lessons/link-after/${lesson_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lesson', 'Courses'],
    }),
    deletePrevLesson: builder.mutation({
      query: (lesson_id) => ({
        url: `/lessons/link-before/${lesson_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lesson', 'Courses'],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useFetchAllTypesQuery,
  useGetLessonQuery,
  useGetCourseByTypeQuery,
  useEditCourseMutation,
  useDeleteCourseMutation,
  useEditLessonMutation,
  useDeleteLessonMutation,
  useAddCourseMutation,
  useAddLessonMutation,
  useAddNextLessonMutation,
  useAddPrevLessonMutation,
  useDeleteNextLessonMutation,
  useDeletePrevLessonMutation,
} = course;

export default course;
