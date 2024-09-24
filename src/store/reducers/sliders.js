import { apiSlice } from './apiSlice';

const sliders = apiSlice.injectEndpoints({
  tagTypes: ['Slider', 'Info'],
  endpoints: (build) => ({
    getSliders: build.query({
      query: () => '/sliders/all',
      providesTags: ['Slider'],
    }),
    getSlider: build.query({
      query: (id) => `/sliders/${id}`,
      providesTags: ['Slider'],
    }),
    addSlider: build.mutation({
      query: (data) => ({
        url: '/sliders/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Slider'],
    }),
    editSlider: build.mutation({
      query: ({ id, data }) => ({
        url: `/sliders/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Slider'],
    }),
    deleteSlider: build.mutation({
      query: (id) => ({
        url: `/sliders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Slider'],
    }),
    getInfo: build.query({
      query: () => '/sliders/main?slider_id=1',
      providesTags: ['Info'],
    }),
    updateInfo: build.mutation({
      query: (data) => ({
        url: '/sliders/main/1',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Info'],
    }),
  }),
});

export const {
  useGetSlidersQuery,
  useAddSliderMutation,
  useEditSliderMutation,
  useGetSliderQuery,
  useDeleteSliderMutation,
  useGetInfoQuery,
  useUpdateInfoMutation,
} = sliders;
