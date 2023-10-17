import { useLoginMutation } from '@/services/auth/auth-api.ts'
import { SignIn } from 'components/auth/sign-in'

export const SignInPage = () => {
  const [signIn] = useLoginMutation()

  return <SignIn onSubmit={signIn} />
}
