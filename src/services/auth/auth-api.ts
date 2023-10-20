import { baseApi } from '../base-api.ts'

import {
  LoginArgs,
  LoginResponse,
  MeResponse,
  RecoverPasswordArgs,
  ResetPasswordArgs,
  SignUpArgs,
  SignUpResponse,
  UpdateProfileArgs,
} from '@/services/auth/auth-types.ts'
import { User } from '@/services/types.ts'

const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    me: builder.query<MeResponse, void>({
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          authApi.util.updateQueryData('me', undefined, () => {
            return null
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: ['Me'],
    }),
    signUp: builder.mutation<SignUpResponse, SignUpArgs>({
      query: body => ({
        url: 'v1/auth/sign-up',
        method: 'POST',
        body,
      }),
    }),
    recoverPassword: builder.mutation<void, RecoverPasswordArgs>({
      query: body => ({
        url: 'v1/auth/recover-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordArgs>({
      query: ({ token, ...body }) => ({
        url: `v1/auth/reset-password/${token}`,
        method: 'POST',
        body,
      }),
    }),
    updateProfile: builder.mutation<User, UpdateProfileArgs>({
      query: body => ({
        url: 'v1/auth/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Me'],
    }),
  }),
})

export const {
  useLoginMutation,
  useMeQuery,
  useLogoutMutation,
  useSignUpMutation,
  useRecoverPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
} = authApi
