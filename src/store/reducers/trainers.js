import { apiSlice } from './apiSlice';

const trainers = apiSlice.injectEndpoints({
  tagTypes: ['Trainers'],
  endpoints: (builder) => ({
    getTrainers: builder.query({
      query: () => '/trainers/all',
      providesTags: ['Trainers'],
    }),
    getTrainer: builder.query({
      query: (id) => `/trainers/${id}`,
      providesTags: ['Trainers'],
    }),
    editTrainer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/trainers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Trainers'],
    }),
    deleteTrainer: builder.mutation({
      query: (id) => ({
        url: `/trainers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Trainers'],
    }),
    addTrainer: builder.mutation({
      query: (data) => ({
        url: '/trainers/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Trainers'],
    }),
  }),
});

export const {
  useGetTrainersQuery,
  useGetTrainerQuery,
  useEditTrainerMutation,
  useDeleteTrainerMutation,
  useAddTrainerMutation,
} = trainers;

export default trainers;
