import { baseApi } from '../base-api.ts'

const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    me: builder.query<User, void>({
      query: () => ({
        url: `v1/auth/me`,
        method: 'GET',
      }),
      providesTags: ['Me'],
    }),
    login: builder.mutation<LoginResponse, LoginArgs>({
      query: body => ({
        url: `v1/auth/login`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Me'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'v1/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Me'],
    }),
  }),
})

export const { useLoginMutation, useMeQuery, useLogoutMutation } = authApi

type LoginArgs = {
  email: string
  password: string
  rememberMe?: boolean
}

type LoginResponse = {
  accessToken: string
}

type User = {
  avatar: string | null
  id: string
  email: string
  isEmailVerified: boolean
  name: string
  created: string
  updated: string
}
