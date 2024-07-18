// eslint-disable-next-line import/no-extraneous-dependencies
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://154.194.52.246:8000',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: 'authApi',
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => {
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        return {
          url: '/auth/jwt/login',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            Connection: 'keep-alive',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
          },
        };
      },
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: { ...credentials },
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/jwt/logout',
        method: 'POST',
        credentials: 'include',
      }),
    }),
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useResetPasswordMutation,
} = authApi;

export default authApi;
