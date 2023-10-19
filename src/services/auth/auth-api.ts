import { baseApi } from '../base-api.ts'

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

type LoginArgs = {
  email: string
  password: string
  rememberMe?: boolean
}
type SignUpArgs = {
  name: string
  email: string
  password: string
}
type RecoverPasswordArgs = {
  html: string
  email: string
}
type ResetPasswordArgs = {
  token: string
  password: string
}
type UpdateProfileArgs = {
  avatar?: string
  name: string
}

type LoginResponse = {
  accessToken: string
}
type MeResponse = User | null
type SignUpResponse = Pick<User, 'id' | 'email' | 'name'>

type User = {
  avatar: string | null
  id: string
  email: string
  isEmailVerified: boolean
  name: string
  created: string
  updated: string
}
