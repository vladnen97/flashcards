import { User } from '@/services/types.ts'

export type LoginArgs = {
  email: string
  password: string
  rememberMe?: boolean
}
export type SignUpArgs = {
  name: string
  email: string
  password: string
}
export type RecoverPasswordArgs = {
  html: string
  email: string
}
export type ResetPasswordArgs = {
  token: string
  password: string
}
export type UpdateProfileArgs = {
  avatar?: User['avatar']
  name: User['name']
}

export type LoginResponse = {
  accessToken: string
}
export type MeResponse = User | null
export type SignUpResponse = Pick<User, 'id' | 'email' | 'name'>
