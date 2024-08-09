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
    }),
    deleteTrainer: builder.mutation({
      query: (id) => ({
        url: `/trainers/${id}`,
        method: 'DELETE',
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
} = trainers;

export default trainers;
