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
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    editUser: builder.mutation({
      query: (data) => ({
        url: `/users/${data.id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useUpdateAvatarMutation,
  useGetMeQuery,
  useEditProfileMutation,
  useAllUsersQuery,
  useDeleteUserMutation,
  useEditUserMutation,
} = user;

export default user;
