import { apiSlice } from './apiSlice';

const user = apiSlice.injectEndpoints({
  tagTypes: ['User'],
  endpoints: (builder) => ({
    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: '/users/update-avatar',
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
    getMe: builder.query({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    editProfile: builder.mutation({
      query: (data) => ({
        url: '/users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    allUsers: builder.query({
      query: () => '/users/all',
      providesTags: ['User'],
    }),
  }),
});

export const { useUpdateAvatarMutation, useGetMeQuery, useEditProfileMutation } = user;

export default user;
